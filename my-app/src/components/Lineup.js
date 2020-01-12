import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlayerShirt from 'components/PlayerShirt'

export default class Lineup extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    let formation = this.props.formation.split("-")
    formation.unshift(1)
    formation = this.props.reversed ? formation.reverse() : formation

    let shirts = []
    let player_num = this.props.reversed ? 10 : 0

    for(let i=0;i<formation.length;i++){
      let row = []
      for(let j=0;j<formation[i];j++){
        row.push(
            <div style={{width:'7%', display:'inline-block', margin:'2% 5%'}}>
                <PlayerShirt
                    name={this.props.lineup['starting_lineups'][String(player_num)]['lineup_player']}
                    away={this.props.reversed}/>
            </div>
            )
        player_num += this.props.reversed ? -1 : 1
      }
      shirts.push(<div>{row}</div>)
    }

    return (
      <div>
        {shirts}
      </div>
    );
  }
}


Lineup.propTypes = {
  lineup: PropTypes.string.isRequired,
  formation: PropTypes.string.isRequired,
  reversed: PropTypes.bool,
}