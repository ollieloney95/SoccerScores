import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CountryIcon from 'components/CountryIcon';
import LeagueIcon from 'components/LeagueIcon';
import { connect } from 'react-redux';


class TileDataCountry extends Component {

    constructor(props) {
          super(props);
          this.state = {
              open: '',
              countriesList:[],
          }
      };

      fetch_get_countries(){
        console.log('fetch_get_countries')
        console.log('process.env.REACT_APP_BACKEND_PORT_MIDDLE', process.env.REACT_APP_BACKEND_PORT_MIDDLE)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_sidebar_info/", {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ countryData: data})});
      }

      componentWillMount() {
        this.fetch_get_countries()
      };

   handleClick = (label) => {
        if(this.state.open !== label){
            this.setState({open:label})
        }else{
            this.setState({open:''})
        }
     }

   setCountriesList = (dat) => {
        if(!dat){
            return null
        }
        let cids = Object.keys(dat)
        // convert cids to ints
        for(let i=0; i<cids.length;i++) cids[i] = parseInt(cids[i])
        let elements_to_return = []
        for(let i=0;i<cids.length;i++){
            let cid = cids[i]
            elements_to_return.push(this.getCountryElement(cid, dat[cid]))
        }
        return(elements_to_return)
   }

   getCountryElement = (cid, countryData) => {
        let element_to_return = []
        let country_name = countryData['country_name']
        let league_names = countryData['leagues']['league_names']
        let league_ids = countryData['leagues']['league_ids']
        // convert league ids to int
        for(let i=0; i<league_ids.length;i++) league_ids[i] = parseInt(league_ids[i])
        {console.log(cid)}
        element_to_return.push(
            <ListItem button key={cid} onClick={() => this.handleClick(country_name)}>
                <ListItemIcon>
                  <CountryIcon country_id={cid} />
                </ListItemIcon>
                <ListItemText primary={country_name} />
                {this.state.open === country_name ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            )
        for(let i=0;i<league_ids.length;i++){
            let league_id = league_ids[i]
            let league_name = league_names[i]
            element_to_return.push(
                <Link to="/LeagueInfo" style={{textDecoration: 'none'}}>
                  <Collapse in={this.state.open === country_name} timeout="auto" unmountOnExit onClick={()=>this.props.changeLeagueId(league_id, league_name, cid, country_name)}>
                    <List component="div" style={{paddingLeft:'20px'}}>
                        {console.log(league_id)}
                      <ListItem key={league_id} button>
                        <ListItemIcon>
                          <LeagueIcon league_id={league_id} height='20px' width='20px'/>
                        </ListItemIcon>
                        <ListItemText primary={league_name}/>
                      </ListItem>
                    </List>
                  </Collapse>
               </Link>
           )
        }
        return(element_to_return)
   }

  render() {
    return (
      <div>
        <List component="nav" >
          {this.setCountriesList(this.state.countryData)}
        </List>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
        return {
            changeLeagueId: (lid, lnm, cid, cnm) => {
                console.log("setting global league_id as : ", lid, lnm);
                const action = { type: 'set_league_id', league_id: lid, league_name: lnm, country_id: cid, country_name: cnm};
                dispatch(action);
            }
        }
     }

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(TileDataCountry);
