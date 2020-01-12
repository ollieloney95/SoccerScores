import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { connect, Provider } from 'react-redux';


class TeamsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              teams: []
          }
    };

    componentDidMount(){
        this.fetch_get_teams()
    }

    fetch_get_teams(){
        console.log('fetch_get_teams: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_all_teams/")
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_all_teams/", {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.format_team_data(data)});
    }

    format_team_data = (data) => {
        this.setState({teams:data})
    }

    handleSelect = (e, v) => {
       if (!v){
        return
       }
       this.props.changeTeam(v.team_name)
       window.location.href='/TeamPage'
    }


  render() {
    return (
      <Paper>
         <b>
            Search teams...
         </b>
         <Autocomplete
               options={this.state.teams}
               getOptionLabel={option => option.team_name}
               style={{margin:'20px auto', width: 300 }}
               onChange={this.handleSelect}
               renderInput={params => (
                 <TextField {...params} label="Select Team" variant="outlined" fullWidth />
               )}
             />

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

export default connect(mapStateToProps, mapDispatchToProps)(TeamsPage);