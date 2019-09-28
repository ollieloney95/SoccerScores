import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

export default class ScoreIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    scoreBackColour = (matchFinished) =>{
        if(matchFinished){
            return('rgb(255, 255, 17)')
        }
        return('rgb(0, 183, 255)')

    }

    scoreBorderColour = (team_score, other_score) =>{
        if(team_score > other_score){
            return('rgb(0, 153, 51)')
        }else if(team_score < other_score){
            return('rgb(255, 0, 30)')
        }
        return('rgb(117, 117, 117)')
    }

  render() {
      return (
            <Paper
                    style={{display:'inline-block',
                            width:'16px',
                            height:'16px',
                            backgroundColor:this.scoreBackColour(this.props.matchFinished),
                            borderWidth:'2px',
                            borderStyle:'solid',
                            marginTop:'5px',
                            borderColor:this.scoreBorderColour(this.props.score,this.props.otherScore)}}
                    elevation={0}
                    square={true}
                    >
                <p style={{fontSize:'12px', fontWeight:'bold', position: 'absolute', marginTop: '1px', marginLeft:'5px'}}>
                    {this.props.score}
                </p>
            </Paper>
      );
  }
}

