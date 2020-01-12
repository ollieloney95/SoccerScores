import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import TeamInfoRow from 'components/TeamInfoRow';
import LeagueInfoRow from 'components/LeagueInfoRow';
import {getFavorite} from 'utils/Requests'

class FavoritesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              standingsData: null,
              whichTab:0,
              teams:[],
              leagues:[],
          }
    };

    componentWillMount(){
        let favs = getFavorite(this.props.store.username)
        favs.then(res => {
            this.setState({teams: res['teams'], leagues: res['leagues']})
        })
    }

  handleChange = (event, value) => {
    this.setState({whichTab:value});
  };

  render() {
    let Leagues
    let Teams
    let Players

    Leagues = <div style={{height:'1000px', width:'80%', marginLeft:'10%', backgroundColor:'red'}}></div>


    Leagues = (<div style={{height:'1000px', width:'80%', marginLeft:'10%'}}>
                    {this.state.leagues.map(leagueId =>
                        <div style={{margin: '5px'}}>
                            <LeagueInfoRow leagueId={leagueId}/>
                        </div>
                        )
                    }
                 </div>)

    Teams = (<div style={{height:'1000px', width:'80%', marginLeft:'10%'}}>
                {this.state.teams.map(teamName =>
                    <div style={{margin: '5px'}}>
                        <TeamInfoRow teamName={teamName}/>
                    </div>
                    )
                }
             </div>)
    Players = <div style={{height:'1000px', width:'80%', marginLeft:'10%', backgroundColor:'red'}}></div>


    return (
      <div>
        <AppBar position="static"  color="default" style={{width:'100%'}}>
          <h4 style={{display:'inline',width:'20%', marginBottom:'0px', paddingBottom:'0px'}}>Favorites</h4>
          <Tabs style={{display:'inline',width:'100%'}}fullWidth centered value={this.state.whichTab} onChange={this.handleChange}>
            <Tab label="Teams" />
            <Tab label="Leagues" />
          </Tabs>
        </AppBar>
        {this.state.whichTab === 0 && <div>{Teams}</div>}
        {this.state.whichTab === 1 && <div>{Leagues}</div>}


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