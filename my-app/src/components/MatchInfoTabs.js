import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';
import StatisticsPanel from 'components/StatisticsPanel'
import MatchEventsPanel from 'components/MatchEventsPanel'
import Lineup from 'components/Lineup'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import FullPitch from 'components/FullPitch'


export default class MatchInfoTabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabIndex:0
        }
    };

    handleChange = (event, newValue) => {
        this.setState({tabIndex:newValue});
      };

  render() {

    let matchEventsPanel = (<MatchEventsPanel
        goalScorers={this.props.matchData['goalscorer']}
        cards={this.props.matchData['cards']}
        substitutions={this.props.matchData['substitutions']}
        />)

    let statisticsPanel = (<StatisticsPanel
        statistics={this.props.matchData['statistics']}
        />)

    let lineupPanel = (
        <FullPitch matchData={this.props.matchData} />
        )

    let matchNotBegan
    if(this.props.matchData['match_status'] === ''){
        matchNotBegan = (<p>waiting for match to Start...</p>)
    }

    return (
        <div>
            <Paper style={{marginBottom:'10px'}}>
                {matchNotBegan}
                <Tabs
                    fullWidth
                    value={this.state.tabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                  >
                    <Tab label="Event" disabled={this.props.matchData['match_status'] === ''}/>
                    <Tab label="Stats" disabled={this.props.matchData['match_status'] === ''}/>
                    <Tab label="Lineup"  disabled={this.props.matchData['match_status'] === ''}/>
                  </Tabs>
            </Paper>
            {this.state.tabIndex === 0 ? matchEventsPanel:''}
            {this.state.tabIndex === 1 ? statisticsPanel:''}
            {this.state.tabIndex === 2 ? lineupPanel:''}
        </div>
    );
  }
}

MatchInfoTabs.propTypes = {
  matchData: PropTypes.object.isRequired
}