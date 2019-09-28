import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import {Link} from 'react-router-dom'
import store from 'store/'
import TileDataCountry from './TileDataCountry'
import { Router } from 'react-router';
import { Provider } from 'react-redux'
import { connect } from 'react-redux';


function logout(){
    store.dispatch({ type: 'logout'})
}


const favorites = (
  <div>
    <Link to="/Favorites">
        <ListItem key={'fav'} button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Favorites"/>
        </ListItem>
    </Link>
  </div>
);

const tileDataCountry = <TileDataCountry/>

class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let loginout
        if(this.props.logged_in){
            loginout=<div>
                        <Link to="/LoginPage" style={{textDecoration: 'none'}}>
                            <ListItem button key={'login'} onClick={logout}>
                              <ListItemIcon>
                                <MailIcon />
                              </ListItemIcon>
                              <ListItemText primary="Log Out" />
                           </ListItem>
                        </Link>
                      </div>
        }else{
            loginout=<div>
                        <Link to="/LoginPage" style={{textDecoration: 'none'}}>
                            <ListItem button key={'login2'} onClick={logout}>
                              <ListItemIcon>
                                <MailIcon />
                              </ListItemIcon>
                              <ListItemText primary="Log In" />
                           </ListItem>
                        </Link>
                      </div>
        }
        return (
            <div style={{position:'fixed',
                         width: this.props.drawerWidth,
                         zIndex: 1,
                         paddingLeft:'10px'
                         }}>

                <Paper>
                      <List>{favorites}</List>
                      <Divider />
                      {tileDataCountry}
                      <Divider />
                      <List>{loginout}</List>
                </Paper>
            </div>
        );
    }
}

export default (SideBar);