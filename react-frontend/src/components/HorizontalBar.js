import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class HorizontalBar extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    let proportion = this.props.home / (this.props.home + this.props.away )
    return (
      <div>
        <div style={{display:'inline-block', width:String(proportion*100)+"%", height:'30px', backgroundColor:'rgb(71, 69, 133)'}}>
            <p style={{float:'left', margin:'5px', fontSize:'15px', color:'white'}}>{String(this.props.home)+this.props.suffix}</p>
        </div>
        <div style={{display:'inline-block', width:String((1-proportion)*100)+"%", height:'30px', backgroundColor:'rgb(86, 128, 145)'}}>
            <p style={{float:'right', margin:'5px', fontSize:'15px', color:'white'}}>{String(this.props.away)+this.props.suffix}</p>
        </div>
      </div>
    );
  }
}

HorizontalBar.propTypes = {
  home: PropTypes.number.isRequired,
  away: PropTypes.number.isRequired,
  suffix: PropTypes.string.isRequired
}