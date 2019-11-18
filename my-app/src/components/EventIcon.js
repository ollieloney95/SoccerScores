import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default class EventIcon extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    console.log('this.props.event', this.props.event)
    return (
      <div style={{display:'inline-block'}}>
        <img
            height='15px'
            width='15px'
            src={("").concat("/images/EventIcons/", this.props.event, ".png")}
            alt={""}
            />
      </div>
    );
  }
}

EventIcon.propTypes = {
  event: PropTypes.string.isRequired
};