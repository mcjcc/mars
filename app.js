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

// app.get('/picture') {
//   UserProfile.findOne()
// }

app.get('/profile/:username/:password', (req, res) => {
  console.log('CALLED GET PROFILE');
  const { username, password } = req.params;
  UserProfile.getProfile(username)
    .then((profile) => {
      console.log('SENDING BACK PROFILE: ', profile);
      res.send(profile);
    })
    .catch((err) => {
      res.send(err);
    });
})

app.post('/profile', (req, res) => {
  console.log('PROFILE POST BODY', req.body);
  UserProfile.getProfile(req.body.username)
    .then((profile) => {
      if (profile) {
        sendStatus(201);
      } else {
        UserProfile.insertProfile({
          username: req.body.username,
          password: req.body.password,
          aboutme: 'Enter a description!',
          picture: 'http://placecorgi.com/260/180'
        })
          .then(() => {
            UserProfile.getProfile(req.body.username)
              .then((profile) => {
                console.log('SENDING BACK', profile);
                res.send(profile);
              });
          });
      }
    })
    .catch((err) => {
      res.send(err);
    });
  //check if profile already exists
    //if profile already exists, send back 201 without data
  //else if profile does not exist,
    //create a profile with provided un and pw with dummy data
    //send back the profile
  // UserProfile.insertProfile(req.body)
  //   .then(() => {
  //     res.sendStatus(201);
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
});

app.post('/update/aboutme/:username', (req, res) => {
  const { username } = req.params;
  console.log('username', username, 'req.body', req.body.aboutme);
  UserProfile.updateAboutMe(req.body.aboutme, username)
    .then(() => {
      res.send('updated aboutme');
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post('/update/picture/:username', (req, res) => {
  const { username } = req.params;
  console.log('WWWWWWWWWW', username);
  var form = new formidable.IncomingForm();
  var files = {};
  var fields = {};
  form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname, './temp');
  form.keepExtensions = true;
  form
    .on('field', function(field, value) {
      fields[field] = value;
    })
    .on('file', function(field, file) {
      files[field] = file;
    })
    .on('end', function() {
      console.log('~> upload done');
      var newFileName = path.basename(files.imageFile.path);
      var contentType = files.imageFile.type;
      fs.readFile(files.imageFile.path, function(err, imgFileData) {
        s3Helper.saveImage(imgFileData, newFileName, contentType)
        .then((fileUrl) => {
          return UserProfile.updatePicture(fileUrl, username)
            .then(() => {
              res.send('updated picture');
            });
          })
          .catch((err) => {
            res.send(err);
          });
        })
      });



  form.parse(req);
});

app.post('/update/aboutme/:aboutme', (req, res) => {
  const { aboutme } = req.params;
  //db.update
  res.sendStatus(200);
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
    // resutlts.estimatedProfit =
    results.releaseDate = movieData.release_date;
    results.images = images;
    results.trailerKey = trailerKeys[0]; //  use first trailer video key
    //results.searchTime = moment.now()

    const smData = [
      await movieTrend(results.title, results.releaseDate),
      await avgTweetEmotion(results.title),
    ];
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
