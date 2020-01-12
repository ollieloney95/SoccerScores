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
        <div style={{margin:'0px', display:'inline-block', verticalAlign:'top'}}>
            <EventIcon
                height={20}
                width={20}
                event={outcome}/>
        </div>
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