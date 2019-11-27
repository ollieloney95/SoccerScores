import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ScoreIcon from 'components/ScoreIcon';
import ClubIcon from 'components/ClubIcon';

export default class TeamHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teamInfo: null
        }
    }

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
    return (
      <Paper style={{height:'100px', margin:'3px'}}>
        <div style={{float:'left', textAlign:'left'}}>
            <b style={{fontSize:24}}>
                {this.props.teamName}
            </b>

            <p style={{fontSize:17, margin:'10px'}}>
                {this.state.teamInfo ? this.state.teamInfo['country_name'] : null}
                {' / '}
                {this.state.teamInfo ? this.state.teamInfo['league_name'] : null}
            </p>

            <p style={{fontSize:17, margin:'0px 10px'}}>
                {'league position: '}
                {this.state.teamInfo ? this.state.teamInfo['pos'] : null}
            </p>
        </div>

        <div style={{float:'right', margin:'5px'}}>
            <ClubIcon height={90} width={90} clubName={this.props.teamName}/>
        </div>
      </Paper>
    );
  }
}


TeamHeader.propTypes = {
  teamName: PropTypes.string.isRequired
};