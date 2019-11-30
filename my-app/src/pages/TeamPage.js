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
import TabsForTeam from 'components/TabsForTeam';


class TeamPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              teamInfo: null
          }
    };

  render() {
    if (!this.props.store.teamName) {
        return <Redirect push to="/TeamsPage" />;
    }
    return (
        <div>
          <TeamHeader teamName={this.props.store.teamName} />
          <TabsForTeam teamName={this.props.store.teamName} />
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