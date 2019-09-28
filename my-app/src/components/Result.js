import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import ClubIcon from './ClubIcon';
import { connect } from 'react-redux';

class Result extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shadow: 0
        }
    }

    score_back_colour = (game_finished) =>{
        if(!game_finished){
            return('rgb(255, 255, 17)')
        }
        return('rgb(0, 183, 255)')

    }

    score_border_colour = (team_score, other_score) =>{
            if(team_score > other_score){
                return('rgb(0, 153, 51)')
            }else if(team_score < other_score){
                return('rgb(255, 0, 30)')
            }
            return('rgb(117, 117, 117)')
        }

    handleClick = (match_id) => {
        console.log('handle click to set ', match_id)
        this.props.changeMatchId(match_id)
    }


    onMouseOver = () => this.setState({ shadow: 2 });
    onMouseOut = () => this.setState({ shadow: 0 });

  render() {
    return (
      <Paper
            square={true}
            elevation={this.state.shadow}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseOut}
            style={{padding:'0px', marginTop:'5px', textAlign:'center', height:'30px', width:'calc(100%)', position:'relative'}}
            onClick={() => this.handleClick(this.props.match_id)}
        >
            <p style={{margin:'5px', display:'inline-block', position: 'absolute', textAlign:'right', right:'calc(50% + 50px)'}}>
                {this.props.home_team}
            </p>
            <div style={{display:'inline-block', margin:'0 auto', width:'100px'}}>
                <Paper
                        style={{display:'inline-block',
                                width:'16px',
                                backgroundColor:this.score_back_colour(this.props.match_status === 'FT'),
                                borderWidth:'2px',
                                borderStyle:'solid',
                                borderColor:this.score_border_colour(this.props.home_score,this.props.away_score)}}
                        elevation={0}
                        square={true}
                    >
                    {this.props.home_score}
                </Paper>
                <Paper
                        style={{display:'inline-block',
                                width:'50px',
                                margin:'0 5px',
                                backgroundColor:'rgb(217, 217, 217)'}}
                        elevation={0}
                    >
                    {this.props.match_time}
                </Paper>
                <Paper
                        style={{display:'inline-block',
                                width:'16px',
                                backgroundColor:this.score_back_colour(this.props.match_status === 'FT'),
                                borderWidth:'2px',
                                borderStyle:'solid',
                                borderColor:this.score_border_colour(this.props.away_score, this.props.home_score)}}
                        elevation={0}
                        square={true}
                    >
                    {this.props.away_score}
                </Paper>
            </div>
            <p style={{margin:'5px', display:'inline-block', position: 'absolute'}}>
                {this.props.away_team}
            </p>
      </Paper>
    );
  }
}

function mapDispatchToProps(dispatch) {
        return {
            changeMatchId: (match_id) => {
                console.log("setting global match_id as : ", match_id);
                const action = { type: 'set_match_id', match_id: match_id};
                dispatch(action);
            }
        }
     }

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);