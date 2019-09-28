import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

class FavoritesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              standingsData: null,
              whichTab:0,
          }
    };

  handleChange = (event, value) => {
    this.setState({whichTab:value});
  };

  render() {
    let Leagues
    let Teams
    let Players

    Leagues = <div style={{height:'1000px', width:'80%', marginLeft:'10%', backgroundColor:'red'}}></div>
    Teams = <div style={{height:'1000px', width:'80%', marginLeft:'10%', backgroundColor:'blue'}}></div>
    Players = <div style={{height:'1000px', width:'80%', marginLeft:'10%', backgroundColor:'red'}}></div>


    return (
      <div>
        <AppBar position="static"  color="default" style={{width:'100%'}}>
          <h4 style={{display:'inline',width:'20%', marginBottom:'0px', paddingBottom:'0px'}}>Favorites</h4>
          <Tabs style={{display:'inline',width:'100%'}}fullWidth centered value={this.state.whichTab} onChange={this.handleChange}>
            <Tab label="Leagues" />
            <Tab label="Teams" />
            <Tab label="Players" href="#basic-tabs" />
          </Tabs>
        </AppBar>
        {this.state.whichTab === 0 && <div>{Leagues}</div>}
        {this.state.whichTab === 1 && <div>{Teams}</div>}
        {this.state.whichTab === 2 && <div>{Players}</div>}


      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
        return {}
     }

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesPage);