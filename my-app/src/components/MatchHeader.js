import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';


export default class MatchHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    formatDate = (date_ts) =>{    //todo this is repeated
        let date = new Date(parseInt(date_ts) * 1000)
        let day = date.toLocaleString('en-us', {  weekday: 'short' })
        let dayOfMonth = date.getDate()
        let month = date.toLocaleString('en-us', {  month: 'short' })
        return(day + ' ' + dayOfMonth + ' ' + month)
    }

  render() {

    return (
      <div id='banner' style={{position:'relative', marginBottom:'10px'}}>
          <img
                  width='100%'
                  src={("/images/bannerFootballCrop.jpg")}
                  alt={""}
              />
          <div id='banner-left' style={{position:'absolute', height:'100px', width:'40%', textAlign:'centre', top:'5%', left:'10px'}}>
              <h3 style={{ color:"rgb(255, 255, 255)", margin:'0px'}}>
                  {this.props.matchData['match_hometeam_name'] + ' vs ' + this.props.matchData['match_awayteam_name']}
              </h3>
              <h4 style={{color:"rgb(255, 255, 255)", margin:'0px'}}>
                  {this.props.matchData['match_status']}
              </h4>
          </div>
          <div id='banner-right' style={{position:'absolute', height:'100px', width:'40%', textAlign:'right', top:'5%', right:'10px'}}>
              <h3 style={{color:"rgb(255, 255, 255)", margin:'0px'}}>
                  {this.props.matchData['match_time']}
              </h3>
              <h3 style={{color:"rgb(255, 255, 255)", margin:'0px'}}>
                  {this.formatDate(this.props.matchData['match_date'])}
              </h3>
          </div>

      </div>
    );
  }
}

MatchHeader.propTypes = {
  matchData: PropTypes.object.isRequired
}