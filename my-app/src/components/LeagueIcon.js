import React, { Component } from 'react';
import {LeagueConfig} from 'configs/IconConfig.js';
import PropTypes from 'prop-types';

export default class LeagueIcon extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div>
        <img
            height='25px'
            width='25px'
            src={("").concat("/images/Leagues/", this.props.leagueName ,".png")} />
      </div>
    );
  }
}

LeagueIcon.propTypes = {
  leagueName: PropTypes.string.isRequired
}
