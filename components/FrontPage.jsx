import React from 'react';
import SearchBox from '../containers/SearchBox';
import MovieDetail from '../containers/MovieDetail';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import FrontPageGridListView from './FrontPageMovieGridList';
import TileImageView from './TileView';
import sampleData from './sampleData';


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
  }

  changeView(option, imageElement ) {
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

  renderView() {
    let currentView = this.state.view;
    if (currentView === 'search') {
      return (
        <div>
          <SearchBox />
          <MovieDetail />
        </div>
      );
    } else if (currentView === 'tileView') {
      return (
        <TileImageView  item={this.state.tile}/>
      );
    } else {
      return <div className= "grids-container">
      {this.state.data.map(function (item, index) {
          return <FrontPageGridListView key={item.tmdbId} element={item} viewChanger={this.changeView}/> ;
        }.bind(this))}
      </div>
    }
  }

  render() {
      var buttons = (
        <div>
          <RaisedButton label="Home" className="mainPage" onClick={() => this.changeView('MainPage')}/>
          <RaisedButton label="Search" className="search" onClick={() => this.changeView('search')} />
        </div>
      );

    return (
      <div>
        <AppBar
          title="Cliff Movie DB"
          iconElementLeft={<img src="https://s3.amazonaws.com/tt-public-assets/Cliff_icon.png" alt="Logo" />}
          iconElementRight={buttons} 
        />
        <div className="viewChanger"> {this.renderView()} </div>
      </div>
    );
  }
}

export default FrontPage;