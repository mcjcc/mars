import React from 'react';
import SearchBox from '../containers/SearchBox';
import Login from '../containers/Login';
import Signup from '../containers/Signup';
import Profile from '../containers/Profile';
import MovieDetail from '../containers/MovieDetail';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import FrontPageGridListView from './FrontPageMovieGridList';
import TileImageView from './TileView';
import sampleData from './sampleData';
import NowPlaying from '../containers/NowPlaying';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logout } from '../actions/MovieAction';

class FrontPage extends React.Component {
  constructor(){
    super();
    this.state = {
      view: 'MainPage',
      tile: '',
      data: sampleData
    };
    this.changeView = this.changeView.bind(this);
    this.renderView = this.renderView.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  changeView(option, imageElement ) {
    if (option === 'logout') {
      this.props.logout();
      this.setState({
        view: option,
        tile: [imageElement]
      });
    }

    if (option && imageElement) {
      this.setState({
        view: option,
        tile: [imageElement]
      });
    } else {
      this.setState({
        view: option
      });
    }
  }

  componentDidMount() {
    $.ajax({
      url: 'movies/data', 
      data: 'data',
      success: (data) => {
        this.setState({
          data: data
        });
      }, 
      error: (err) => {
        console.log('this is the error in ajax', err);
      }
    });
  }

  renderView() {
    let currentView = this.state.view;
    if (currentView === 'search') {
      return (
        <div>
          <NowPlaying />
          <SearchBox />
          <MovieDetail />
        </div>
      );
    } else if (currentView === 'tileView') {
      return (
        <TileImageView  item={this.state.tile}/>
      );
    } else if (currentView === 'login') {
      if (this.props.profile.username) {
        return (
          <Profile changeView={this.changeView}/>
        );
      } else {
        return (
          <Login />
        );
      }
    } else if (currentView === 'signup') {
      if (this.props.profile.username) {
        return (
          <Profile changeView={this.changeView}/>
        );
      } else {
        return (
          <Signup />
        );
      }
    } else if (currentView === 'profile') {
      return (
        <Profile changeView={this.changeView}/>
      );
    }   else {

      return <div className= "grids-container">
      {this.state.data.map(function (item, index) {
          return <FrontPageGridListView key={item.tmdbId} element={item} viewChanger={this.changeView}/> ;
        }.bind(this))}
      </div>
    }
  }

  renderButtons() {
    if (this.props.profile.username) {
      return (
          <div>
            <RaisedButton label="Home" className="mainPage" onClick={() => this.changeView('MainPage')}/>
            <RaisedButton label="Search" className="search" onClick={() => this.changeView('search')} />
            <RaisedButton label="Logout" className="logout" onClick={() => this.changeView('logout')} />
            <RaisedButton label="Profile" className="profile" onClick={() => this.changeView('profile')} />
          </div>
      );
    } else {
      return (
          <div>
            <RaisedButton label="Home" className="mainPage" onClick={() => this.changeView('MainPage')}/>
            <RaisedButton label="Search" className="search" onClick={() => this.changeView('search')} />
            <RaisedButton label="Login" className="login" onClick={() => this.changeView('login')} />
            <RaisedButton label="Signup" className="signup" onClick={() => this.changeView('signup')} />
          </div>
      );
    }
  }

  render() {

    return (
      <div>
        <AppBar
          title="VenusFOODCOURT Movie DB"
          iconElementLeft={<img src="https://s3-us-west-1.amazonaws.com/venusfoodcourt/moviedb/Moon_Venus_logo.png" alt="Logo" className="main-logo"/>}
          iconElementRight={this.renderButtons()}
        />
        <div className="viewChanger"> {this.renderView()} </div>
      </div>
    );
  }
}

function mapStateToProps({ profile }) {
  return { profile };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FrontPage);