import React, { Component } from 'react';
import { connect } from 'react-redux';
import MatchesByDay from 'components/MatchesByDay';


export default class ResultsByDay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              resultsByDay: null,
          }
    };

    componentWillMount(){
        this.fetch_get_fixtures(this.props.league_id)
    }

    componentWillReceiveProps (nextprops) {
        if(this.props.league_id === nextprops.league_id){
            return
        }
        this.fetch_get_fixtures(nextprops.league_id)
    }

    fetch_get_fixtures(league_id){
        console.log('fetch_get_fixtures: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + league_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + league_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ fixturesByDay: this.formatFixturesData(data)}); console.log('data in fetch ', data)});
    }

    formatFixturesData = (resultsRaw) => {
        let fixturesByDay = {}
        for (var match_id in resultsRaw) {
          let date = new Date(parseInt(resultsRaw[match_id].match_date) * 1000)
          let day = date.toLocaleDateString('en-us')
          if(!(day in fixturesByDay)){
            fixturesByDay[day] = [resultsRaw[match_id]]
          }else{
            fixturesByDay[day].push(resultsRaw[match_id])
          }
        }
        return(fixturesByDay)
    }

  render() {
    return (
      <div>
            <MatchesByDay matchesByDay={this.state.fixturesByDay} sortAscending={false}/>
      </div>
    );
  }
}

