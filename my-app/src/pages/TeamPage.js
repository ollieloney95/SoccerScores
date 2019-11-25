import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';


export default class TeamPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              teams: []
          }
    };

    componentWillMount(){
        this.fetch_get_teams()
    }

    fetch_get_teams(){
        console.log('fetch_get_teams: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_all_teams/")
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_all_teams/", {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {console.log(data)});
    }


  render() {
    return (
      <Paper>
         <b>
            Team
         </b>
      </Paper>
    );
  }
}