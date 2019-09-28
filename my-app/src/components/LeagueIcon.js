import React, { Component } from 'react';
import {LeagueConfig} from 'configs/IconConfig.js';

class LeagueIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              leagueString: this.getImageFromId(this.props.league_id),
          }
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
            src={("").concat("/images/Leagues/",this.state.leagueString,".png")} />
      </div>
    );
  }
}

export default LeagueIcon;