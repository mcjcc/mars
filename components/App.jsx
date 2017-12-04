import React from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import FrontPage from './FrontPage';
import SearchBox from '../containers/SearchBox';
import MovieDetail from '../containers/MovieDetail';
import NowPlaying from '../containers/NowPlaying';

export default function App() {
  return (
    <Paper>
      <FrontPage />    
    </Paper>
  );
}
