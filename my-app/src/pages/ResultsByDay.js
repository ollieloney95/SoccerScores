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
        this.fetch_get_results(this.props.league_id)
    }

    componentWillReceiveProps (nextprops) {
        if(this.props.league_id === nextprops.league_id){
            return
        }
        this.fetch_get_results(nextprops.league_id)
    }

    fetch_get_results(league_id){
        console.log('fetch_get_results: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_results/" + league_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_results/" + league_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ resultsByDay: this.formatResultsData(data)})});
      }

    formatResultsData = (resultsRaw) => {
        let resultsByDay = {}
        for (var match_id in resultsRaw) {
          let date = new Date(parseInt(resultsRaw[match_id].match_date) * 1000)
          let day = date.toLocaleDateString('en-us')
          if(!(day in resultsByDay)){
            resultsByDay[day] = [resultsRaw[match_id]]
          }else{
            resultsByDay[day].push(resultsRaw[match_id])
          }
        }

        return(resultsByDay)
    }

  render() {
    return (
      <div>
            <MatchesByDay matchesByDay={this.state.resultsByDay} sortAscending={true}/>
      </div>
    );
  }
}

