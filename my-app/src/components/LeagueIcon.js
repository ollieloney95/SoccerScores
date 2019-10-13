import React, { Component } from 'react';
import {LeagueConfig} from 'configs/IconConfig.js';
import PropTypes from 'prop-types';

class LeagueIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    getImageFromId(id){
        return(LeagueConfig['leagueList'][id])
    }

  render() {
    return (
      <div>
        <img
            width = {this.props.width}
            height = {this.props.height}
            src={("").concat("/images/Leagues/", this.getImageFromId(this.props.league_id) ,".png")} />
      </div>
    );
  }
}

export default LeagueIcon;

LeagueIcon.propTypes = {
  league_id: PropTypes.number.isRequired
}