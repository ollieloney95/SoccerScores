import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';


export default class MatchOverview extends React.Component {

    constructor(props) {
        super(props);
    }


  render() {

    return (
      <Paper style={{marginBottom:'10px'}}>
        Match overview here !
      </Paper>
    );
  }
}

MatchOverview.propTypes = {
  matchData: PropTypes.object.isRequired
}