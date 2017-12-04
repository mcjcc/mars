import React from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';

import { fetchMovie1, fetchProfile } from '../actions/MovieAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';

import TextField from 'material-ui/TextField';

const url = 'https://image.tmdb.org/t/p/w154';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      view: 'textView'
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleTextFieldKeyDown = this.handleTextFieldKeyDown.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.onAboutMeClick = this.onAboutMeClick.bind(this);
  }

  handleImageChange(e) {
    e.preventDefault();
    let formData = new FormData();
    console.log('ATTEMPT TO CHANGE IMAGE');
    formData.append('imageFile', e.target.files[0]);
    
    axios.post(`/update/picture/${this.props.profile.username}`, formData)
      .then((response) => {
        console.log(response);
        this.props.fetchProfile(this.props.profile.username);
      })
      .catch((error) => {
        console.log('Error in update picture: ', error);
      });
    // axios.post(`/update/picture/Johnny`, formData)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log('Error in update picture: ', error);
    //   });
  }

  onFavoritesClick(tmdbId) {
    console.log('CLICKED FAVORITE TMDB', tmdbId);
    this.props.fetchMovie1(tmdbId);
    this.props.changeView('search');
  }

  onAboutMeClick(e) {
    console.log('CLICKED');
    this.setState({text: this.props.profile.aboutme, view: 'textField'});
  }

  handleTextFieldChange(e) {
    this.setState({ text: e.target.value });
  }

  handleTextFieldKeyDown(e) {

    if (e.key === 'Enter') {
      e.preventDefault();
      axios.post(`/update/aboutme/${this.props.profile.username}`, { aboutme: this.state.text })
        .then((response) => {
          console.log('LETS FETCH THE PROFILE');
          this.props.fetchProfile(this.props.profile.username);
        })
        .catch(err => console.error(err));

      this.setState({view: 'textView'});
      if (this.state.text === '') {
        this.setState({text: 'Enter a Description'});
      }
    }
  }

  renderView() {
    if (this.state.view === 'textField') {
      return  <div style={{width: '320px', marginLeft: '20px', borderStyle: 'solid', borderColor: 'grey', borderRadius: 4, borderSize: 1}}>
                <TextField
                  name="aboutme"
                  multiLine={true}
                  rows={2}
                  value={this.state.text}
                  fullWidth={true}
                  rowsMax={4}
                  onChange={this.handleTextFieldChange}
                  onKeyDown={this.handleTextFieldKeyDown}
                />
              </div>
    } else if (this.state.view === 'textView') {
      return <div style={{overflowY: 'auto'}}>
              <p

                style={{marginLeft: '20px', height: 100, width: 300, textAlign: 'left'}}
                onClick={this.onAboutMeClick}
              >
                {this.props.profile.aboutme}
              </p>
              </div>
    }
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex'}}>
          <div style={{width: '300px', display: 'flex', flexDirection: 'column'}}>
            <img style={{margin: '20px', width: 250, height: 250, borderRadius: '20px', display: 'flex'}} src={this.props.profile.picture} />
            <RaisedButton
              label="Change Picture"
              labelPosition="before"
              containerElement="label"
            >
              <input onChange={this.handleImageChange} type="file" style={{cursor: "pointer", position: "absolute", opacity: 0}} />
            </RaisedButton>
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <h2 style={{marginLeft: '10px', marginTop: '20px', textAlign: 'left'}}>{this.props.profile.username}</h2>
            <h2 style={{marginLeft: '10px', marginTop: '20px', textAlign: 'left'}}>About Me</h2>
            <div className="changeView" style={{paddingLeft: 0, paddingRight: 50}}>
              {this.renderView()}
            </div>
          </div>
        </div>
        <h1 style={{marginTop: '40px'}}>My Favorite Movies</h1>
        <GridList
          cellHeight={180}
          style={{display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingLeft: '20px', width: 'auto', height: 450}}
        >
        {this.props.profile.favorites.map(function (favorite, index) {
          return  <div key={favorite.tmdbId}>
                    <GridTile
                      title={favorite.title}
                    >
                      <img className='favorite-picture' onClick={() => {this.onFavoritesClick(favorite.tmdbId)}} src={url + favorite.images[0].url} />
                    </GridTile>
                  </div>
                  
        }.bind(this))}
        </GridList>
      </div>
    );
  }
}


function mapStateToProps({ profile }) {
  return { profile };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchMovie1, fetchProfile }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);