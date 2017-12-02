import React from 'react';

const url = 'https://image.tmdb.org/t/p/w154';

class GridList extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    return this.props.viewChanger('tileView', this.props.element);
  }

  render() {
    return (
      <div className="grid-child" >
        <img className="grid-child-img" src={url + this.props.element.images[0]} onClick={this.clickHandler} />
      </div>
    );
  }
}

export default GridList;