import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HorizontalBar from 'components/HorizontalBar';
import Paper from '@material-ui/core/Paper';


export default class StatisticsPanel extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    console.log('this.props', this.props)
    return (
      <Paper>
        <b style={{float:'left', width:'50%', textAlign:'left'}}>
            Home
        </b>
        <b style={{float:'right', width:'50%', textAlign:'right'}}>
            Away
        </b>
        {this.props.statistics.map((stat, index) => {
            return (
                <div key={index}>
                    <b style={{marginTop:'5px'}}>
                        {stat.type}
                    </b>
                    <HorizontalBar
                        home={parseInt(stat.home)}
                        away={parseInt(stat.away)}
                        suffix={stat.type === 'possession (%)'?'%':''}
                        style={{padding:'10px'}}/>
                </div>
            );
        })}
      </Paper>
    );
  }
}

StatisticsPanel.propTypes = {
  statistics: PropTypes.array.isRequired
}