const Sequelize = require('sequelize');
const db = require('./SQLindex.js');

const UserProfile = db.define('profile', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
  aboutme: Sequelize.STRING,
  picture: Sequelize.STRING,
});


const Movies = db.define('movies', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tmdbId: {
    type: Sequelize.INTEGER,
    required: true,
    unique: true,
  },
  title: Sequelize.STRING,
  budget: Sequelize.INTEGER,
  revenue: Sequelize.INTEGER,
  estimatedProfit: Sequelize.INTEGER,
  releaseDate: Sequelize.DATE,
  trailerKey: Sequelize.STRING,
  overview: Sequelize.STRING(1234)
  // searchTime: Sequelize.DATE
});

const ProductionCompanies = db.define('production_companies', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  companyName: {
    type: Sequelize.STRING,
    unique: true,
  },
}, {
  timestamps: false,
});

const ProductionCompaniesMovies = db.define('production_companies_movies', {
}, {
  timestamps: false,
});
Movies.ProductionCompanies = Movies.belongsToMany(ProductionCompanies, {
  through: ProductionCompaniesMovies,
});
ProductionCompanies.Movies = ProductionCompanies.belongsToMany(Movies, {
  through: ProductionCompaniesMovies,
});


// var ProductionMovies = db.define('production_movies', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   companyID: Sequelize.INTEGER,
//   movieID: Sequelize.INTEGER
// });

const Genres = db.define('genres', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  genreName: {
    type: Sequelize.STRING,
    unique: true,
  },
}, {
  timestamps: false,
});

const GenresMovies = db.define('genres_movies', {
}, {
  timestamps: false,
});

Movies.belongsToMany(Genres, {
  through: GenresMovies,
});
Genres.belongsToMany(Movies, {
  through: GenresMovies,
});

// var GenreMovies = db.define('genre_movies', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   genreID: Sequelize.INTEGER,
//   movieID: Sequelize.INTEGER
// });

const Images = db.define('images', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: Sequelize.STRING,
}, {
  timestamps: false,
});

Movies.hasMany(Images);
Images.belongsTo(Movies);

const TrendData = db.define('trend_data', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  formattedAxisTime: Sequelize.STRING,
  dataValue: Sequelize.INTEGER,
}, {
  timestamps: false,
});

Movies.hasMany(TrendData);
TrendData.belongsTo(Movies);

const Favorites = db.define('favorites', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: false,
});

UserProfile.belongsToMany(Movies, {
  through: Favorites,
});
Movies.belongsToMany(UserProfile, {
  through: Favorites,
});

db.sync();


/*
movies
  .then
  movies.genres = genres_movies movieId: movie.id
    genre on genreid
  movies.images = images movieId: movie.id
  movies.trendData = trendData movieId: movie.id
  movies.prod = prod movieId: movie.id
   prod on prodid
*/
// Movies
// ProductionCompanies
// ProductionCompaniesMovies
// Genres
// GenresMovies
// Images
// TrendData


function insertMovie(movie) {
  // console.log(movie);
  return Movies.create({
    tmdbId: movie.tmdbId,
    title: movie.title,
    budget: movie.budget,
    revenue: movie.revenue,
    estimatedProfit: movie.estimatedProfit,
    releaseDate: movie.releaseDate,
    trailerKey: movie.trailerKey, 
    overview: movie.overview

  }).then((newMovie) => {
    let promises = [];
    // newMovie.dataValues.id;
    for (let i = 0; i < movie.genres.length; i++) {
      promises.push(Genres.findOrCreate({
        where: {
          genreName: movie.genres[i],
        },
      }).then((genre) => {
        return GenresMovies.create({
          movieId: newMovie.dataValues.id,
          genreId: genre[0].dataValues.id,
        });
      }));
    }
    for (let j = 0; j < movie.productionCompanies.length; j++) {
      promises.push(ProductionCompanies.findOrCreate({
        where: {
          companyName: movie.productionCompanies[j]
        },
      }).then((company) => {
        return ProductionCompaniesMovies.create({
          movieId: newMovie.dataValues.id,
          productionCompanyId: company[0].dataValues.id
        });
      }));
    }

    for (var k = 0; k < movie.images.length; k++) {
      promises.push(Images.create({
        url: movie.images[k],
        movieId: newMovie.dataValues.id
      }));
    }

    for (var l = 0; l < movie.trendData.length; l++) {
      promises.push(TrendData.create({
        formattedAxisTime: movie.trendData[l].formattedAxisTime,
        dataValue: movie.trendData[l].value,
        movieId: newMovie.dataValues.id
      }));
    }
    return Promise.all(promises);
  });
  // for (var i = 0; i < movie.genres; i++) {
  //   Genres.create({
  //     genreName: movie.genres[i]
  //   });
  //   Images.create({
  //     url: movie.images[i],
  //     movieId:
  //   });
  // }
};

// insertMovie({
//   tmdbId: 423,
//   title: 'hey',
//   budget: 600,
//   revenue: 700,
//   estimatedProfit: 800,
//   productionCompanies: ['hi', 'hello'],
//   genres: ['hi', 'hey'],
//   images: ['url1', 'url2'],
//   trendData: [{formattedAxisTime: 'hi', value: 5}, {formattedAxisTime: 'hello', value: 6}]
// });


function findRecentMovies() {
  return db.sync()
    .then(() => {
      return Movies.findAll({
        raw: true,
        limit: 10,
        order: [['updatedAt', 'DESC']],
      })
        .then((movies) => {
          var findImage = (i) => {
            return Images.findAll({
              where: {movieId: movies[i].id},
              raw: true,
            })
              .then((images) => {
                movies[i].images = images;
                return movies[i];
              })
          }
          var promises = [];
          for (var i = 0; i < movies.length; i++) {
            promises.push(findImage(i));
          }
          return Promise.all(promises);
        });
    });
}

console.log('FIND RECENT MOVIES');
findRecentMovies({tmdbId: 1})
  .then((movies) => {
    console.log('WWWWWWWWWWWWWWWWWW');
    console.log(movies[0].images[0]);
  })





function findMovie({ tmdbId }) {
  return db.sync()
    .then(() => {
      return Movies.findOne({
        where: {tmdbId: tmdbId},
        raw: true
      })
        .then((movie) => {
          if (!movie) {
            return Promise.resolve(undefined);
          }
          let promises = [];
          promises.push(GenresMovies.findAll({
            where: {movieId: movie.id},
            raw: true
          }).then((genreMovies) => {
            var genres = [];
            for (var i = 0; i < genreMovies.length; i++) {
              genres.push( Genres.findOne({
                where: {id: genreMovies[i].genreId},
                raw: true
              }).then((res)=>{return res.genreName}));
            }
            return Promise.all(genres);
          }).then((promise) => {
            // console.log('GENRES', promise);
            return promise;
          }));

          promises.push(ProductionCompaniesMovies.findAll({
            where: {movieId: movie.id},
            raw: true
          }).then((companyMovies) => {
            var companies = [];
            for (var i = 0; i < companyMovies.length; i++) {
              companies.push( ProductionCompanies.findOne({
                where: {id: companyMovies[i].productionCompanyId},
                raw: true
              }).then((res)=>{return res.companyName}));
            }
            return Promise.all(companies);
          }).then((promise) => {
            // console.log('COMPANIES', promise);
            return promise;
          }));

          promises.push(Images.findAll({
            where: {movieId: movie.id},
            raw: true
          }).then((res) => {
            var images = [];
            for (var i = 0; i < res.length; i++) {
              images.push(res[i].url);
            }
            // console.log ('IMAGES', images);
            return images;
          }));

          promises.push(TrendData.findAll({
            where: {movieId: movie.id},
            raw: true
          }).then((res) => {
            var dataValues = [];
            for (var i = 0; i < res.length; i++) {
              dataValues.push({
                formattedAxisTime: res[i].formattedAxisTime,
                value: res[i].dataValue, _id: res[i].id,
              });
            }
            // console.log('DATAVALUES', dataValues);
            return dataValues;
          }));
          return Promise.all(promises)
            .then((vals) => {
              movie.genres = vals[0];
              movie.productionCompanies = vals[1];
              movie.images = vals[2];
              movie.trendData = vals[3];
              return movie;
            });
        });
      })
      .catch((err) => {
        console.log('EEEEEEEE', err);
        return undefined;
      });
}

function insertProfile(newProfile) {
  return UserProfile.create(newProfile);
}

function updatePicture(newPicture, username) {
  return UserProfile.update({picture: newPicture}, { where: {username: username} });
}

function updateAboutMe(newAboutMe, username) {
  console.log('WWWWWWWWWWWWWWWWWWWWWWW', newAboutMe, username);
  return UserProfile.update({aboutme: newAboutMe}, { where: {username: username} });
}

function getProfile(username) {
  return db.sync()
    .then(() => {
      return UserProfile.findOne({
        where: {username: username},
        raw: true
      });
    });
}

function getFavorites(username) {
  return db.sync()
    .then(() => {
      return getProfile(username)
        .then((profile) => {
          //get movie id from favorites
          return Favorites.findAll({
            where: {profileId: profile.id},
            raw: true
          })
            .then((favorites) => {
              let promises = [];
              for (var i = 0; i < favorites.length; i++) {
                promises.push(Movies.findOne({
                  where: {id: favorites[i].movieId},
                  raw: true
                }));
              }
              return Promise.all(promises);
              console.log('FAVORITES ARE', favorites);
            });
        });
    });
}

function insertFavorite(username, movieId) {
  return getProfile(username)
    .then((profile) => {
      return Favorites.create({profileId: profile.id, movieId: movieId});
    });
}

module.exports.UserProfile = {findRecentMovies, getProfile, insertProfile, updatePicture, updateAboutMe };
module.exports.Movie = { insertMovie, findMovie };
// function getMovieTableData(callback) {
//   return Movies.findAll()
//     .then(function(result) {
//       console.log('releaseDateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', result);
//       return Images.findAll({
//         where: {
//           movieId: result.id
//         }
//       })
//       .then(function(imagesArrays) {
//         callback(null, imagesArrays);
//       })
//       .catch(function(err){
//         console.log('err is', err);
//       })
      
//       console.log('the result of finding everything in the movie table is  ', result);
//     })
//     .catch(function(err) {
//       callback(err, null);
//       console.log('following error has occured while retrieving data from the  movie table', err);
//     })
// }

// getMovieTableData(function(err, result){
//   if (err) {
//     console.log('following errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr in getMovieTableData', err);
//   } else {
//     console.log('resulttttttttttttttttttttttttttttttttttttttttttttttttt', result);
//   }
// });
//module.exports.UserProfile = { getProfile, insertProfile, updatePicture, updateAboutMe };


// promises.push(GenresMovies.create)

// const mongoose = require('mongoose');
// require('./index.js');

// const movieSchema = new mongoose.Schema({
//   tmdbId: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   title: String,
//   productionCompanies: [{
//     type: String,
//   }],
//   genres: [{
//     type: String,
//   }],
//   images: [{
//     type: String,
//   }],
//   budget: Number,
//   revenue: Number,
//   estimatedProfit: Number,
//   releaseDate: Date,
//   trendData: [{
//     formattedAxisTime: String,
//     value: Number,
//   }],
// });

// const Movie = mongoose.model('Movie', movieSchema);

// module.exports = SQLMovie;
