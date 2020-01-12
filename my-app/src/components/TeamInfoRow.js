import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ScoreIcon from 'components/ScoreIcon';
import ClubIcon from 'components/ClubIcon';
import { AddToFavoritesTeam, AddToFavoritesLeague } from 'components/AddToFavorites';
import Last5 from 'components/Last5';
import { connect, Provider } from 'react-redux';


class TeamHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teamInfo: null,
            shadow: 0
        }
    }

    onMouseOver = () => this.setState({ shadow: 4 });
    onMouseOut = () => this.setState({ shadow: 0 });

    componentWillMount(){
        this.fetch_get_team_info(this.props.teamName)
    }

    handleSelect = (e) => {
       this.props.changeTeam(this.props.teamName)
       window.location.href='/TeamPage'
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
      <Paper
            onClick={this.handleSelect}
            elevation={this.state.shadow}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseOut}
            style={{height:'40px', width:'100%'}}>
        <div style={{float:'left', margin:'3px 0px'}}>
            <ClubIcon
                height={34}
                width={34}
                clubName={this.props.teamName}
            />
        </div>
        <b style={{float:'left', fontSize:16, margin:'10px 0px'}}>
            {this.props.teamName}
        </b>


        <div style={{position:'absolute', marginLeft:'130px'}}>
            <p style={{fontSize:14, margin:'10px 5px', display:'inline-block', verticalAlign:'top'}}>
                {this.state.teamInfo ? this.state.teamInfo['league_name'] : null}
            </p>

            <b style={{fontSize:14, margin:'10px 0px', display:'inline-block', verticalAlign:'top'}}>
                {this.state.teamInfo ? this.state.teamInfo['pos'] : null}
            </b>
        </div>

        <div style={{float:'right', margin:'10px 10px'}}>
            <Last5 teamName={this.props.teamName} />
        </div>

      </Paper>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        changeTeam: (teamName) => {
            console.log("setting global team as : ", teamName);
            const action = { type: 'set_team', teamName: teamName};
            dispatch(action);
        }
    }
 }

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamHeader);


TeamHeader.propTypes = {
  teamName: PropTypes.string.isRequired
};