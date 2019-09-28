import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import ClubIcon from './ClubIcon';

class Fixture extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div style={{padding:'0px', marginTop:'5px', textAlign:'center', height:'30px', width:'calc(100%)', position:'relative'}}>
            <p style={{margin:'5px', display:'inline-block', position: 'absolute', textAlign:'right', right:'calc(50% + 25px)'}}>
                {this.props.home_team}
            </p>
            <Paper style={{display:'inline-block', margin:'0 auto', width:'50px', backgroundColor:'rgb(217, 217, 217)'}} elevation={0}>
                {this.props.match_time}
            </Paper>
            <p style={{margin:'5px', display:'inline-block', position: 'absolute'}}>
                {this.props.away_team}
            </p>
      </div>
    );
  }
}


export default Fixture;