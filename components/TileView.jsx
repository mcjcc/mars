import React from 'react';

const url = 'https://image.tmdb.org/t/p/w154';

class TileView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var releaseDate = this.props.item[0].releaseDate.slice(0, 10);
    var moneyValidator = function(value) {
      if (value) {
        return '$' + value;
      } else {
        return "N/A";
      }
    }

    var revenue = moneyValidator(this.props.item[0].revenue);
    var budget =  moneyValidator(this.props.item[0].budget);
    return (
      <div className='tile-view'>
          <img className="tile-img" src={url + this.props.item[0].images[0].url}/>
        <div className="tile-img-text">
          <font size="8" ><strong>{this.props.item[0].title}</strong> </font><br />
          <font size="5">{'Release Date:  ' + releaseDate}</font><br />
          <font size="5">{'Revenue:  ' + revenue}</font><br />
          <font size="5">{'Budget:  ' + budget} </font><br />
          <font size="4">{'Overview:  ' + this.props.item[0].overview} </font><br />
        </div>
      </div>
    );
  }
}

export default TileView;