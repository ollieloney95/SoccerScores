import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

export default class TeamsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              deafault: null
          }
    };


  render() {
    return (
      <div>
         Should be a list of teams here
      </div>
    );
  }
}