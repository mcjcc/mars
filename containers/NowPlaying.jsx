import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import MovieList from '../components/MovieList';

class NowPlaying extends Component {
  constructor() {
    super();
    this.state = {
      newReleases: []
    }

    this.fetchNewReleases = this.fetchNewReleases.bind(this);
  }

  fetchNewReleases() {

  }

  render() {

    return (
      <div>
        Now Playing
        <MovieList
          movies={this.state.newReleases}
          fetchMovie={this.fetchNewReleases}
        />
      </div>
    );

  }
}

export default NowPlaying;
