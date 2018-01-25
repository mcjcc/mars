const express = require('express');
const tmdb = require('./utils/tmdb');
const { movieTrend } = require('./utils/trendFetch');
const { avgTweetEmotion } = require('./utils/twitterEmotion');
const formidable = require('formidable');
const { UserProfile, Movie } = require('./db/SQLMovie');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const s3Helper = require('./helpers/s3-helper.js');
// const passport = require('passport');
// const Strategy = require('passport-local').Strategy;

const app = express();


app.use(express.static('public'));
app.use(bodyParser.json());


// passport.use(new Strategy(
//   (username, password, cb) => {
//     User.findByUsername(username)
//       .then((user) => {
//         if (!user) {
//           return cb(null, false);
//         } else {
//           if (user.password != password) {
//             return cb(null, false);
//           } else {
//             return cb(null, user);
//           }
//         }
//       })
//       .catch((err) => {
//         return cb(err);
//       });
//   }));

// passport.serializeUser((user, cb) => {
//   cb(null, user.id);
// });

// passport.deserializeUser((id, cb) => {
//   User.findById(id)
//     .then((user) => {
//       return cb(null, user);
//     })
//     .catch((err) => {
//       return cb(err);
//     });
// });


const port = process.env.PORT || 7331;

app.get('/', (req, res) => {
  console.log('this is the landing page!');
  res.send('This is the landing page!');
});


app.get('/fetchNowPlaying', (req, res) => {
  console.log('/fetchNowPlaying');
  tmdb.fetchMoviesNowPlaying().then((data) => {
    res.send(data);
  });
});

app.get('/search/:movie', (req, res) => {
  console.log('search movie: ', req.params.movie);
  tmdb.searchMoviesByName(req.params.movie).then((data) => {
    res.send(data);
  });
});

app.get('/movie/:tmdbId', async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const movie = await Movie.findMovie({ tmdbId });
    if (movie) {
      // console.log(movie);
      //TODO: update movie table searchTime to now
      const emotion = await avgTweetEmotion(movie.title);
      const results = movie;
      results.emotion = emotion;
      return res.send(results);
    }

    const data = [await tmdb.fetchMovieById(tmdbId), await tmdb.fetchImageById(tmdbId), await tmdb.fetchMovieTrailersById(tmdbId)];
    const movieData = data[0];
    const images = data[1];
    const trailerKeys = data[2]; // trailers should be an array of youtube keys (string)

    const results = { tmdbId };
    results.title = movieData.title;
    results.productionCompanies = movieData.production_companies.map(company => company.name);
    results.genres = movieData.genres.map(genre => genre.name);
    results.budget = movieData.budget;
    results.revenue = movieData.revenue;
    results.estimatedProfit = results.revenue - results.budget;
    results.releaseDate = movieData.release_date;
    results.images = images;
    results.overview = movieData.overview;
    results.trailerKey = trailerKeys[0]; //  use first trailer video key
    //results.searchTime = moment.now()

    const smData = [
      await movieTrend(results.title, results.releaseDate),
      await avgTweetEmotion(results.title),
    ];
    console.log(smData);
    const trendData = smData[0];
    const emotion = smData[1];

    const { timelineData } = JSON.parse(trendData).default;
    results.trendData = timelineData.map((trend) => {
      let { formattedAxisTime } = trend;
      if (trend.formattedAxisTime.length < 7) formattedAxisTime += ', 2017';
      return {
        formattedAxisTime,
        value: (trend.value[0] / trend.value[1]) * 100,
      };
    });

    await Movie.insertMovie(results);

    results.emotion = emotion;
    return res.send(results);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

module.exports = app.listen(port, () => console.log(`Listening on port ${port}`));
