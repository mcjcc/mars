import React from 'react';

const url = 'https://image.tmdb.org/t/p/w154';

class TileView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='tile-view'>
        <img className="tile-img" src={url + this.props.item[0].images[0]}/>
        <h2>{this.props.item[0].title}</h2>
      </div>
    );
  }
}

export default TileView;