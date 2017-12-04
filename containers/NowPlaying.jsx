import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import MovieList from '../components/MovieList';
import { fetchMovie1 } from '../actions/MovieAction';


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
    this.props.fetchMovie1(id)
      .then(() => {
        this.props.getFavorite();
      });
  }

  fetchNowPlaying() {
    axios.get('/fetchNowPlaying')
    .then((response) => {
      this.setState({ nowPlaying: response.data.results });
    });
  }

  componentDidMount() {
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

function mapStateToProps({ primaryMovie }) {
  return { primaryMovie };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchMovie1 }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NowPlaying);
// export default NowPlaying;
