import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PlayerShirt extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div style={{height:'100%', width:'100%'}}>
        <img
            src={"/images/kits/homeKit.png"}
            style={{height:'100%', width:'100%'}}
            />
        <b style={{fontSize:'10px'}}>
            {this.props.name}
        </b>
      </div>
    );
  }
}


PlayerShirt.propTypes = {
  name: PropTypes.string,
  number: PropTypes.number,
  team: PropTypes.string
}