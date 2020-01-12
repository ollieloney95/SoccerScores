import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ClubIcon from 'components/ClubIcon';


export default class MatchOverview extends React.Component {

    constructor(props) {
        super(props);
    }


  render() {


    console.log('matchData', this.props.matchData)

    return (
      <Paper style={{marginBottom:'10px'}}>
        <Result matchData={this.props.matchData}/>
      </Paper>
    );
  }
}




class Result extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div style={{ margin:'auto', padding:'20px'}}>
                <div style={{margin:'0 5px', display:'inline-block', verticalAlign:'top'}}>
                    <ClubIcon clubName={this.props.matchData['match_hometeam_name']} />
                </div>
                <p style={{margin:'5px', display:'inline-block'}}>
                    {this.props.matchData['match_hometeam_name']}
                </p>
                <b style={{margin:'5px', display:'inline-block'}}>
                    {this.props.matchData['match_hometeam_score']}
                </b>
                <p style={{margin:'5px', display:'inline-block'}}>
                    {this.props.matchData['match_time']}
                </p>
                <b style={{margin:'5px', display:'inline-block'}}>
                    {this.props.matchData['match_awayteam_score']}
                </b>
                <p style={{margin:'5px', display:'inline-block'}}>
                    {this.props.matchData['match_awayteam_name']}
                </p>
                <div style={{margin:'0 5px', display:'inline-block', verticalAlign:'top'}}>
                    <ClubIcon clubName={this.props.matchData['match_awayteam_name']} />
                </div>
            </div>
        )
    }

}


MatchOverview.propTypes = {
  matchData: PropTypes.object.isRequired
}

