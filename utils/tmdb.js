const axios = require('axios');

/*
 * Fetch search results from TMDB by keyword query
 * @param {String} query
 * @return {Promise:Object} results
 */
exports.searchMoviesByName = query => {
  console.log('exports.searchMoviesByName in tmdb file');
  return axios.get('http://api.themoviedb.org/3/search/movie', {
    params: {
      api_key: process.env.API_KEY,
      // 'language': 'en-US',
      query,
    },
  }).then(res => (
    res.data
  )).catch(err => console.error(err.response.data.status_message))
};

/*
 * Fetch movie data from TMDB by TMDB ID
 * @param {Number} id
 * @return {Promise:{see https://developers.themoviedb.org/3/movies/get-movie-details}} data
 */
exports.fetchMovieById = id => {
  console.log('exports.fetchMovieById in tmdb file');
  return axios.get(`http://api.themoviedb.org/3/movie/${id}`, {
    params: {
      api_key: process.env.API_KEY,
      // 'language': 'en-US',
    },
  }).then(res => (
    res.data
  )).catch(err => console.error(err.response.data.status_message))
};

/*
 * Fetch promotional images from TMDB by TMDB ID
 * @param {Number} id
 * @return {Promise:[String]} images
 */
exports.fetchImageById = id => {
  return axios.get(`http://api.themoviedb.org/3/movie/${id}/images`, {
    params: {
      api_key: process.env.API_KEY,
      // 'language': 'en-US',
    },
  }).then((res) => {
    const images = res.data.backdrops;
    return images.map(img => img.file_path);
  }).catch(err => console.error(err.response.data.status_message))
};

exports.fetchMoviesNowPlaying = () => {
  return axios.get(`https://api.themoviedb.org/3/movie/now_playing`, {
    params: {
      api_key: process.env.API_KEY,
      region: 'US',
    },
  }).then((res) => {
    return res.data;
  }).catch(err => console.error(err.response.data.status_message))
};

exports.fetchMovieTrailer = (id) => {
  return axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    params: {
      api_key: process.env.API_KEY,
      language: 'en-US'
    },
  }).then((res) => {
    let videos = res.data.results;
    return videos.map(video => video.key);
  }).catch(err => console.error(err.response.data.status_message));
};
