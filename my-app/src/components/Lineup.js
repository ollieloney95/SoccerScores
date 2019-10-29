import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlayerShirt from 'components/PlayerShirt'

export default class Lineup extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    let formation = this.props.formation.split("-")
    let shirts = []
    let k = 0

    for(let i=0;i<formation.length;i++){
      let row = []
      for(let j=0;j<formation[i];j++){
        row.push(
            <div style={{width:'5%', display:'inline-block', margin:'5px 30px'}}>
                <PlayerShirt name={this.props.lineup['starting_lineups'][String(k)]['lineup_player']} />
            </div>
            )
        k++
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
}