import React, { Component } from 'react';
import LeagueTable from '../components/LeagueTable';
import FixturesByDay from 'pages/FixturesByDay';
import ResultsByDay from 'pages/ResultsByDay';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

class LeaguePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              standingsData: null,
              whichTab:0,
          }
    };

  handleChange = (event, value) => {
    this.setState({whichTab:value});
  };

  render() {
    let leagueTableTab
    let leagueFixturesTab
    let leagueResultsTab

    leagueTableTab = <LeagueTable league_id = {this.props.store.league_id} country_name = {this.props.store.country_name} style={{width:'90%',marginLeft:'5%'}}/>
    leagueResultsTab = <ResultsByDay league_id = {this.props.store.league_id} />
    leagueFixturesTab = <FixturesByDay league_id = {this.props.store.league_id} />

    return (
      <div>
        <AppBar position="static"  color="default" style={{width:'100%'}}>
          <h4 style={{display:'inline', height:'10px', textAlign:'left', margin:'0px', padding:'10px'}}>
            {this.props.store.country_name + ' - ' + this.props.store.league_name}
          </h4>
          <Tabs style={{display:'inline',width:'100%'}} variant="fullWidth" centered value={this.state.whichTab} onChange={this.handleChange}>
            <Tab label="Table" />
            <Tab label="Fixtures" />
            <Tab label="Results" href="#basic-tabs" />
          </Tabs>
        </AppBar>
        {this.state.whichTab === 0 && <div style={{width:'100%'}}>{leagueTableTab}</div>}
        {this.state.whichTab === 1 && <div>{leagueFixturesTab}</div>}
        {this.state.whichTab === 2 && <div>{leagueResultsTab}</div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(LeaguePage);