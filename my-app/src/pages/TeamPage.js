import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { connect, Provider } from 'react-redux';
import { Redirect } from 'react-router';
import PreviousResultsPanel from 'components/PreviousResultsPanel';


class TeamPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              teams: []
          }
    };

    componentWillMount(){
        //this.fetch_get_teams()
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
    if (!this.props.store.teamName) {
        return <Redirect push to="/TeamsPage" />;
    }
    return (
        <div>
          <Paper>
             <b>
                {this.props.store.teamName}
             </b>
          </Paper>
          <PreviousResultsPanel teamName={this.props.store.teamName} />
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
        return {}
     }

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamPage);