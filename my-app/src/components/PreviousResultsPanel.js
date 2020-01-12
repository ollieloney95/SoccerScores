import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ResultCompressed from 'components/ResultCompressed';

export default class PreviousResultsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            previousMatchData: null
        }
    }

    componentWillMount(){
        this.fetchPreviousMatches(this.props.teamName)
    }

    componentWillReceiveProps (nextprops) {
        this.fetchPreviousMatches(nextprops.teamName)
    }

    fetchPreviousMatches(teamName){
        console.log('fetchPreviousMatches: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_last_matches_for_team/" + teamName + "/")
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_last_matches_for_team/" + teamName + "/", {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => this.setState({previousMatchData: data}))
      }


  render() {
    if(!this.state.previousMatchData){
        return(
            <Paper>
                loading...
            </Paper>
        )
    }

    let results = this.state.previousMatchData.map((d) =>
        <ResultCompressed
            teamName = {d['team_name']}
            opponentName = {d['opponent']}
            home = {d['home']}
            homeScore = {d['home_score']}
            awayScore = {d['away_score']}/>
    )

    return (
      <div>
        {results}
      </div>
    );
  }
}


PreviousResultsPanel.propTypes = {
  teamName: PropTypes.string.isRequired,
};