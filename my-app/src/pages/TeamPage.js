import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { connect, Provider } from 'react-redux';
import { Redirect } from 'react-router';
import PreviousResultsPanel from 'components/PreviousResultsPanel';
import TeamHeader from 'components/TeamHeader';
import LeagueTable from 'components/LeagueTable';


class TeamPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              teams: [],
              teamInfo: null
          }
    };

    componentWillMount(){
        this.fetch_get_team_info(this.props.store.teamName)
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
    if (!this.props.store.teamName) {
        return <Redirect push to="/TeamsPage" />;
    }
    let leagueTable
    if(this.state.teamInfo){
        console.log('this.state.teamInfo', this.state.teamInfo)
        leagueTable = <LeagueTable league_id={this.state.teamInfo['league_id']} country_name={this.state.teamInfo['country_name']} />
    }
    return (
        <div>
          <TeamHeader teamName={this.props.store.teamName}/>
          <div style={{backgroundColor:'red', width:'100%', position:'relative'}}>
            <div style={{margin:0, display:'inline-block', verticalAlign:'top', width:'220px', backgroundColor:'blue'}}>
              <PreviousResultsPanel teamName={this.props.store.teamName} />
            </div>
            <div style={{margin:0, display:'inline-block', verticalAlign:'top', width:'calc(100% - 300px)', backgroundColor:'green'}}>
              {leagueTable}
            </div>
          </div>
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