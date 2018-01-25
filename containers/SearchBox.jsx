import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import { cyan100 } from 'material-ui/styles/colors';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import { fetchProfile, fetchMovie1, fetchMovie2 } from '../actions/MovieAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';

class SearchBox extends Component {
  constructor() {
    super();

    this.state = {
      primaryMovieList: [],
      secondaryMovieList: [],
    };

    this.style = {
      padding: '25px',
    };

    this.imgUrl = 'https://image.tmdb.org/t/p/w92';
    this.chipColor = cyan100;

    this.onMovieSearch = this.onMovieSearch.bind(this);
    this.fetchPrimaryMovie = this.fetchPrimaryMovie.bind(this);
    this.fetchSecondaryMovie = this.fetchSecondaryMovie.bind(this);
  }

  onMovieSearch(query, type) {
    axios.get(`/search/${query}`)
      .then((response) => {
        if (type === 'primary') this.setState({ primaryMovieList: response.data.results });
        else if (type === 'secondary') this.setState({ secondaryMovieList: response.data.results });
      })
      .catch(err => console.error(err));
  }

  fetchPrimaryMovie(id) {
    this.setState({ primaryMovieList: [] });
    this.props.fetchMovie1(id);
  }

  fetchSecondaryMovie(id) {
    this.setState({ secondaryMovieList: [] });
    this.props.fetchMovie2(id);
  }

  render() {
    const hasPrimaryMovieList = this.state.primaryMovieList.length > 0;
    const hasSecondaryMovieList = this.state.secondaryMovieList.length > 0;
    const { primaryMovie, secondaryMovie } = this.props;
    return (
      <Paper zDepth={2} style={this.style}>
        <SearchBar
          onMovieSearch={this.onMovieSearch}
          floatingLabelText="Search Primary Movie"
          type="primary"
        />
        {hasPrimaryMovieList &&
        <MovieList
          movies={this.state.primaryMovieList}
          fetchMovie={this.fetchPrimaryMovie}
        />}
        {!hasPrimaryMovieList && primaryMovie.title &&
        <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
          <Chip style={{ margin: '0px' }} backgroundColor={this.chipColor}>
            <Avatar src={this.imgUrl + primaryMovie.images[0]} />
            {primaryMovie.title}
          </Chip>
        </div>
        }
        {primaryMovie.title &&
        <SearchBar
          onMovieSearch={this.onMovieSearch}
          floatingLabelText="Search Secondary Movie"
          type="secondary"
        />}
        {hasSecondaryMovieList &&
        <MovieList
          movies={this.state.secondaryMovieList}
          fetchMovie={this.fetchSecondaryMovie}
        />}
        {!hasSecondaryMovieList && secondaryMovie.title &&
        <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
          <Chip style={{ margin: '0px' }} backgroundColor={this.chipColor}>
            <Avatar src={this.imgUrl + secondaryMovie.images[0]} />
            {secondaryMovie.title}
          </Chip>
        </div>
        }
      </Paper>
    );
  }
}

SearchBox.propTypes = {
  fetchMovie1: PropTypes.func.isRequired,
  fetchMovie2: PropTypes.func.isRequired,
  primaryMovie: PropTypes.shape({
    title: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  secondaryMovie: PropTypes.shape({
    title: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

function mapStateToProps({ profile, primaryMovie, secondaryMovie }) {
  return { profile, primaryMovie, secondaryMovie };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchProfile, fetchMovie1, fetchMovie2 }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
