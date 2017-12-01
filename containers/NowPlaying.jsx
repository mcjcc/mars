import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import MovieList from '../components/MovieList';
import { fetchMovie1, fetchMovie2 } from '../actions/MovieAction';


class NowPlaying extends Component {
  constructor() {
    super();
    this.state = {
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
  }

  render() {

    return (
      <div>
        Now Playing
        <MovieList
          movies={this.state.nowPlaying}
          fetchMovie={this.fetchPrimaryMovie}
        />
      </div>
    );

  }
}

function mapStateToProps({ primaryMovie, secondaryMovie }) {
  return { primaryMovie, secondaryMovie };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchMovie1, fetchMovie2 }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlaying);
// export default NowPlaying;
