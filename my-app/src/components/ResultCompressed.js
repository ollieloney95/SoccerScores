import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ScoreIcon from 'components/ScoreIcon';
import ClubIcon from 'components/ClubIcon';
import EventIcon from 'components/EventIcon';

export default class PreviousResultsPanel extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {

    let outcome
    if (this.props.homeScore === this.props.awayScore){
        outcome = 'drawn'
    }else if (this.props.homeScore > this.props.awayScore){
        outcome = this.props.home ? 'won' : 'lost'
    }else{
        outcome = this.props.home ? 'lost' : 'won'
    }


    return (
      <Paper style={{width:'220px', margin:'3px 0px', elevation:2}}>

        <div style={{margin:'7px 0px', display:'inline-block', verticalAlign:'top'}}>
            <EventIcon
                height={20}
                width={20}
                event={outcome}/>
        </div>

        <div style={{margin:'0px 3px', paddingRight:'20px', display:'inline-block', verticalAlign:'middle'}}>
          <p style={{margin:'3px 0px', fontSize:'10px', width:'50px'}}>
            vs {this.props.opponentName}
          </p>
        </div>

        <div style={{margin:'5px 3px', display:'inline-block', verticalAlign:'top'}}>
            <ClubIcon clubName={this.props.home ? this.props.teamName : this.props.opponentName}/>
        </div>

        <div style={{margin:'3px 3px', display:'inline-block', verticalAlign:'top'}}>
            <ScoreIcon
                score={this.props.homeScore}
                otherScore={this.props.awayScore}
                matchFinishes={true}/>
        </div>

        <div style={{margin:'3px 3px', display:'inline-block', verticalAlign:'top'}}>
            <ScoreIcon
                score={this.props.awayScore}
                otherScore={this.props.homeScore}
                matchFinishes={true}/>
        </div>

        <div style={{margin:'5px 3px', display:'inline-block', verticalAlign:'top'}}>
            <ClubIcon clubName={this.props.home ? this.props.opponentName : this.props.teamName}/>
        </div>

      </Paper>
    );
  }
}


PreviousResultsPanel.propTypes = {
  teamName: PropTypes.string.isRequired,
  opponentName: PropTypes.string.isRequired,
  home: PropTypes.bool.isRequired,
  homeScore: PropTypes.number.isRequired,
  awayScore: PropTypes.number.isRequired
};