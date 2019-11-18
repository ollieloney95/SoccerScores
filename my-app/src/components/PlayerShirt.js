import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PlayerShirt extends React.Component {

    constructor(props) {
        super(props);
    }

    kitFileLocation = () => {
        let baseLocation = "/images/kits/"
        console.log((this.props.away))
        baseLocation += (this.props.away) ? "awayKit" : "homeKit"
        baseLocation += ".png"
        console.log('baseLocation', baseLocation)
        return baseLocation
    }

  render() {
    return (
      <div style={{width:'100%', position:'relative'}}>
        <img
            src={this.kitFileLocation()}
            style={{height:'85%', width:'100%', margin:'0px', marginBottom:'5%'}}
            />
        <p style={{position:'absolute', height:'10%', width:'100%',fontSize:'9px', fontWeight:'600', margin:'0px', bottom:'0px',letterSpacing: '0px', lineHeight: '1'}}>
            {this.props.name}
        </p>
      </div>
    );
  }
}


PlayerShirt.propTypes = {
  name: PropTypes.string,
  number: PropTypes.number,
  away: PropTypes.string
}