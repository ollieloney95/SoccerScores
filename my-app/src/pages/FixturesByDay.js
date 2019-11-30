import React, { Component } from 'react';
import { connect } from 'react-redux';
import MatchesByDay from 'components/MatchesByDay';
import PropTypes from 'prop-types'


export default class FixturesByDay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              fixturesByDay: null,
          }
    };

    componentWillMount(){
        this.fetch_get_fixtures(this.props.league_id, this.props.daysBack, this.props.daysForward)
    }

    componentWillReceiveProps (nextprops) {
        if(this.props.league_id === nextprops.league_id){
            return
        }
        this.fetch_get_fixtures(nextprops.league_id, nextprops.daysBack, nextprops.daysForward)
    }

    fetch_get_fixtures(league_id, daysBack, daysForward){
        let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_results/" + league_id + "/" + daysBack + "/" + daysForward + "/"
        console.log('fetch_get_results: ', url)
        fetch(url, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ fixturesByDay: this.formatFixtureData(data)})});
      }

    formatFixtureData = (fixturesRaw) => {
        let fixturesByDay = {}
        for (var match_id in fixturesRaw) {
          let date = new Date(parseInt(fixturesRaw[match_id].match_date) * 1000)
          let day = date.toLocaleDateString('en-us')
          if(!(day in fixturesByDay)){
            fixturesByDay[day] = [fixturesRaw[match_id]]
          }else{
            fixturesByDay[day].push(fixturesRaw[match_id])
          }
        }

        return(fixturesByDay)
    }

  render() {
    return (
      <div>
            <MatchesByDay matchesByDay={this.state.fixturesByDay} sortAscending={this.props.sortAscending ? this.props.sortAscending : false}/>
      </div>
    );
  }
}

FixturesByDay.propTypes = {
  league_id: PropTypes.number,
  teamName: PropTypes.string,
  daysBack: PropTypes.number.isRequired,
  daysForward: PropTypes.number.isRequired,
  sortAscending: PropTypes.bool
}


