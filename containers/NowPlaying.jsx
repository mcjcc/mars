import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import MovieList from '../components/MovieList';
<<<<<<< HEAD
<<<<<<< HEAD
import { fetchMovie1, fetchMovie2 } from '../actions/MovieAction';

=======
>>>>>>> Add NowPlaying section
=======
import { fetchMovie1, fetchMovie2 } from '../actions/MovieAction';

>>>>>>> Refactor nowplaying functions and added css to show movie tiles as clickable

class NowPlaying extends Component {
  constructor() {
    super();
    this.state = {
<<<<<<< HEAD
<<<<<<< HEAD
      nowPlaying: []
    }

    this.fetchNowPlaying = this.fetchNowPlaying.bind(this);
    this.fetchPrimaryMovie = this.fetchPrimaryMovie.bind(this);
  }

  fetchPrimaryMovie(id) {
    this.setState({ primaryMovieList: [] });
    this.props.fetchMovie1(id);
  }

  fetchNowPlaying() {
    console.log('fetch now playing');
    axios.get('/fetchNowPlaying')
    .then((response) => {
      console.log('fetchnowplaying then', response);
      this.setState({ nowPlaying: response.data.results });
    });
  }

  componentDidMount() {
    console.log('will mount!');
    this.fetchNowPlaying();
=======
      newReleases: []
=======
      nowPlaying: []
>>>>>>> Refactor nowplaying functions and added css to show movie tiles as clickable
    }

    this.fetchNowPlaying = this.fetchNowPlaying.bind(this);
    this.fetchPrimaryMovie = this.fetchPrimaryMovie.bind(this);
  }

  fetchPrimaryMovie(id) {
    this.props.fetchMovie1(id);
  }

  fetchNowPlaying() {
    console.log('fetch now playing');
    axios.get('/fetchNowPlaying')
    .then((response) => {
      console.log('fetchnowplaying then', response);
      this.setState({ nowPlaying: response.data.results });
    });
  }

<<<<<<< HEAD
>>>>>>> Add NowPlaying section
=======
  componentDidMount() {
    console.log('will mount!');
    this.fetchNowPlaying();
>>>>>>> Refactor nowplaying functions and added css to show movie tiles as clickable
  }

  render() {

    return (
      <div>
        Now Playing
        <MovieList
<<<<<<< HEAD
<<<<<<< HEAD
          movies={this.state.nowPlaying}
          fetchMovie={this.fetchPrimaryMovie}
=======
          movies={this.state.newReleases}
          fetchMovie={this.fetchNewReleases}
>>>>>>> Add NowPlaying section
=======
          movies={this.state.nowPlaying}
          fetchMovie={this.fetchPrimaryMovie}
>>>>>>> Refactor nowplaying functions and added css to show movie tiles as clickable
        />
      </div>
    );

  }
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Refactor nowplaying functions and added css to show movie tiles as clickable
function mapStateToProps({ primaryMovie, secondaryMovie }) {
  return { primaryMovie, secondaryMovie };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchMovie1, fetchMovie2 }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlaying);
// export default NowPlaying;
<<<<<<< HEAD
=======
export default NowPlaying;
>>>>>>> Add NowPlaying section
=======
>>>>>>> Refactor nowplaying functions and added css to show movie tiles as clickable
