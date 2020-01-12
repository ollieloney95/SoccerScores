import React, { Component } from 'react';
import LeagueTable from '../components/LeagueTable';
import FixturesByDay from 'pages/FixturesByDay';
import { connect, Provider } from 'react-redux';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

export default class TabsForTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              standingsData: null,
              whichTab:0,
              teamInfo: null,
          }
    };

  handleChange = (event, value) => {
    this.setState({whichTab:value});
  };

  componentWillMount(){
      this.fetch_get_team_info(this.props.teamName)
  }

  fetch_get_team_info(teamName){
      console.log('fetch_get_team_info: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_team_info/" + teamName + "/")
      fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_team_info/" + teamName + "/", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }})
        .then(response => response.json())
        .then(data => {this.setState({teamInfo: data})});
  }

  render() {
    let leagueTableTab
    let leagueFixturesTab
    let leagueResultsTab

    let leagueId
    let countryName
    if(this.state.teamInfo){
        leagueId = this.state.teamInfo['league_id']
        countryName = this.state.teamInfo['country_name']

        leagueTableTab = <LeagueTable league_id = {leagueId} country_name = {countryName} style={{width:'90%',marginLeft:'5%'}}/>
        leagueResultsTab = <FixturesByDay league_id = {this.props.teamName} daysBack={100} daysForward={0} sortAscending={true}/>
        leagueFixturesTab = <FixturesByDay league_id = {this.props.teamName} daysBack={0} daysForward={100} sortAscending={false}/>
    }

    return (
      <div>
        <AppBar position="static"  color="default" style={{width:'100%'}}>
          <Tabs style={{display:'inline',width:'100%'}} variant="fullWidth" centered value={this.state.whichTab} onChange={this.handleChange}>
            <Tab label="League Table" />
            <Tab label={this.props.teamName + " Fixtures"} />
            <Tab label={this.props.teamName + " Results"} href="#basic-tabs" />
          </Tabs>
        </AppBar>
        {this.state.whichTab === 0 && <div style={{width:'100%'}}>{leagueTableTab}</div>}
        {this.state.whichTab === 1 && <div>{leagueFixturesTab}</div>}
        {this.state.whichTab === 2 && <div>{leagueResultsTab}</div>}
      </div>
    );
  }
}

TabsForTeam.propTypes = {
  teamName: PropTypes.string.isRequired,
}