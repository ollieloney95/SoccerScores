import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import ClubIcon from './ClubIcon';
import { connect } from 'react-redux';
import ScoreIcon from 'components/ScoreIcon';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

class Result extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shadow: 0
        }
    }

    handleClick = (match_id) => {
        console.log('handle click to set ', match_id)
        this.props.changeMatchId(match_id)
        this.setState({redirect: true});
    }

  onMouseOver = () => this.setState({ shadow: 2 });
  onMouseOut = () => this.setState({ shadow: 0 });

  render() {
        let homeScore
        let awayScore
        if(this.props.matchInfo['match_hometeam_score'] !== "" && this.props.matchInfo['match_awayteam_score'] !== ""){
            homeScore = <ScoreIcon
                            score={this.props.matchInfo['match_hometeam_score']}
                            otherScore={this.props.matchInfo['match_awayteam_score']}
                            matchFinished={this.props.matchInfo['match_status'] === 'FT'}/>

            awayScore = <ScoreIcon
                            score={this.props.matchInfo['match_awayteam_score']}
                            otherScore={this.props.matchInfo['match_hometeam_score']}
                            matchFinished={this.props.matchInfo['match_status'] === 'FT'}/>
        }
        if (this.state.redirect) {
            return <Redirect push to="/MatchInfo" />;
        }
    return (
      <Paper
            square={true}
            elevation={this.state.shadow}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseOut}
            style={{padding:'0px', marginTop:'5px', textAlign:'center', height:'30px', width:'calc(100%)', position:'relative'}}
            onClick={() => {this.handleClick(this.props.matchInfo['match_id']); console.log('matchInfo', this.props.matchInfo)}}
        >
            <p style={{margin:'5px', display:'inline-block', position: 'absolute', fontSize:'10px', fontWeight:'bold', right:'calc(50% + 50px)'}}>
                {this.props.matchInfo['match_hometeam_name']}
            </p>
            <div style={{display:'inline-block', margin:'0 auto', width:'110px', height:'30px'}}>
                {homeScore}
                <Paper
                        style={{display:'inline-block',
                                width:'50px',
                                height:'20px',
                                margin:'5px',
                                top:'5px',
                                backgroundColor:'rgb(217, 217, 217)'}}
                        elevation={0}
                    >
                    {this.props.matchInfo['match_time']}
                </Paper>
                {awayScore}
            </div>
            <p style={{margin:'5px', display:'inline-block', position: 'absolute', fontSize:'10px', fontWeight:'bold'}}>
                {this.props.matchInfo['match_awayteam_name']}
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

Result.propTypes = {
  matchInfo: PropTypes.object.isRequired
}