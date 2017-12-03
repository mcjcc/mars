import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { List, ListItem } from 'material-ui/List';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { yellow100, yellow500, red100, red500 } from 'material-ui/styles/colors';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import moment from 'moment';
import Emotion from './Emotion';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openModal, closeModal } from '../actions/ModalAction';

const translateToCurrency = (value) => {
  let num = value;
  let commaCounter = 0;
  let res = '';
  while (num > 0) {
    const dig = num % 10;

    commaCounter += 1;
    if (commaCounter > 3) {
      res = `,${res}`;
      commaCounter %= 3;
    }
    res = dig + res;

    num = Math.floor(num / 10);
  }
  return `$${res}`;
};
class MovieInfo extends Component {
// function MovieInfo(props) {
  constructor(props) {
    super(props);
    this.state = {
      primaryTrailerModalOpen: false,
      secondaryTrailerModalOpen: false
    };

    console.log('this.state.primaryTrailerModalOpen: ', this.state.primaryTrailerModalOpen);
  }

  handlePrimaryTrailerModalOpen() {
    this.setState({primaryTrailerModalOpen: true});
  }

  handleSecondaryTrailerModalOpen() {
    this.setState({secondaryTrailerModalOpen: true});
  }

  handlePrimaryTrailerModalClose() {
    this.setState({primaryTrailerModalOpen: false});
  }

  handleSecondaryTrailerModalClose() {
    this.setState({secondaryTrailerModalOpen: false});
  }

  render() {
    const {primaryMovie, secondaryMovie} = this.props;
    const primaryTitle = primaryMovie.title;
    const secondaryTitle = secondaryMovie.title;
    const actionsPrimaryMovie = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={ () => {this.handlePrimaryTrailerModalClose()} }
        />
    ];
    const actionsSecondaryMovie = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={ () => {this.handleSecondaryTrailerModalClose()} }
        />
    ];
    return (
      <Table fixedHeader>


        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>Movie Info</TableHeaderColumn>
            <TableHeaderColumn>{primaryTitle}</TableHeaderColumn>
            {secondaryTitle && <TableHeaderColumn>{secondaryTitle}</TableHeaderColumn>}
          </TableRow>
        </TableHeader>

        <TableBody
          displayRowCheckbox={false}
          showRowHover
        >
          <TableRow>
            <TableRowColumn>Trailer</TableRowColumn>
            <TableRowColumn>
              {primaryMovie.trailerKey &&
                <RaisedButton label="Watch Trailer" primary={true} onClick={ () => {this.handlePrimaryTrailerModalOpen();} } />
              }
                <Dialog
                  title="Movie Trailer"
                  actions={actionsPrimaryMovie}
                  modal={true}
                  open={this.state.primaryTrailerModalOpen}
                >
                <iframe width="560" height="315" src={`https://www.youtube.com/embed/${primaryMovie.trailerKey}`} frameborder="0" allowfullscreen></iframe>
                </Dialog>
            </TableRowColumn>
            {secondaryTitle &&

              <TableRowColumn>
                {secondaryMovie.trailerKey &&
                  <RaisedButton label="Watch Trailer" primary={true} onClick={ () => {this.handleSecondaryTrailerModalOpen();} } />
                }
                  <Dialog
                    title="Movie Trailer"
                    actions={actionsSecondaryMovie}
                    modal={true}
                    open={this.state.secondaryTrailerModalOpen}
                  >
                  <iframe width="560" height="315" src={`https://www.youtube.com/embed/${secondaryMovie.trailerKey}`} frameborder="0" allowfullscreen></iframe>
                  </Dialog>
              </TableRowColumn>

            }

          </TableRow>


          <TableRow>
            <TableRowColumn>Revenue</TableRowColumn>
            <TableRowColumn>
              {primaryMovie.revenue &&
              <Chip backgroundColor={yellow100}>
                <Avatar icon={<EditorAttachMoney />} color={yellow100} backgroundColor={yellow500} />
                {translateToCurrency(primaryMovie.revenue)}
              </Chip>}
            </TableRowColumn>
            {secondaryTitle &&
            <TableRowColumn>
              <Chip backgroundColor={yellow100}>
                <Avatar icon={<EditorAttachMoney />} color={yellow100} backgroundColor={yellow500} />
                {translateToCurrency(secondaryMovie.revenue)}
              </Chip>
            </TableRowColumn>}
          </TableRow>



          <TableRow>
            <TableRowColumn>Release Date</TableRowColumn>
            <TableRowColumn>
              {primaryMovie.releaseDate &&
              <Chip backgroundColor={red100}>
                <Avatar icon={<ActionSchedule />} color={red100} backgroundColor={red500} />
                {moment(primaryMovie.releaseDate).format('MMMM Do YYYY')}
              </Chip>}
            </TableRowColumn>
            {secondaryTitle &&
            <TableRowColumn>
              <Chip backgroundColor={red100}>
                <Avatar icon={<ActionSchedule />} color={red100} backgroundColor={red500} />
                {moment(secondaryMovie.releaseDate).format('MMMM Do YYYY')}
              </Chip>
            </TableRowColumn>}
          </TableRow>



          <TableRow>
            <TableRowColumn>Reaction</TableRowColumn>
            <TableRowColumn>
              {primaryMovie.emotion && <Emotion emotion={primaryMovie.emotion} />}
            </TableRowColumn>
            {secondaryTitle &&
            <TableRowColumn>
              {secondaryMovie.emotion && <Emotion emotion={secondaryMovie.emotion} />}
            </TableRowColumn>}
          </TableRow>




          <TableRow>
            <TableRowColumn>Genres</TableRowColumn>
            <TableRowColumn>
              <List>
                {primaryMovie.genres &&
                primaryMovie.genres.map(g => <ListItem key={g} primaryText={g} />)}
              </List>
            </TableRowColumn>
            {secondaryTitle &&
            <TableRowColumn>
              <List>
                {secondaryMovie.genres.map(g => <ListItem key={g} primaryText={g} />)}
              </List>
            </TableRowColumn>}
          </TableRow>




          <TableRow>
            <TableRowColumn>Production Companies</TableRowColumn>
            <TableRowColumn>
              <List>
                {primaryMovie.productionCompanies &&
                primaryMovie.productionCompanies.map(pc => <ListItem key={pc} primaryText={pc} />)}
              </List>
            </TableRowColumn>
            {secondaryTitle &&
            <TableRowColumn>
              <List>
                {secondaryMovie.productionCompanies.map(pc => <ListItem key={pc} primaryText={pc} />)}
              </List>
            </TableRowColumn>}
          </TableRow>


        </TableBody>
      </Table>
    );
  }
// }
}

MovieInfo.propTypes = {
  primaryMovie: PropTypes.shape({
    title: PropTypes.string,
    revenue: PropTypes.number,
    releaseDate: PropTypes.string,
    emotion: PropTypes.shape({}),
    genres: PropTypes.arrayOf(PropTypes.string),
    trailerKey: PropTypes.string,
    productionCompanies: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  secondaryMovie: PropTypes.shape({
    title: PropTypes.string,
    revenue: PropTypes.number,
    releaseDate: PropTypes.string,
    emotion: PropTypes.shape({}),
    genres: PropTypes.arrayOf(PropTypes.string),
    trailerKey: PropTypes.string,
    productionCompanies: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  modalOpen: PropTypes.bool,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
};

function mapStateToProps({ modalOneOpen, modalTwoOpen  }) {
  return { modalOneOpen, modalTwoOpen };
}

// function mapStateToProps(_ref) {
//   var modal = _ref.modal;
//
//   return {modal : modal};
// }

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ openModal, closeModal }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieInfo);


// export default MovieInfo;
