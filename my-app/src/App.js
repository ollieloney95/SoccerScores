import React, { Component } from 'react';
import NavBar from 'components/NavBar'
import SideBar from 'components/SideBar/SideBar'
import 'typeface-roboto'
import 'App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

//import pages
import Page1 from 'pages/Page1'
import LeagueTablePage from 'pages/LeagueTablePage'
import FavoritesPage from 'pages/FavoritesPage'
import LoginPage from 'pages/account/LoginPage'
import CreateAccount from 'pages/account/CreateAccount'
import MatchPage from 'pages/MatchPage'

//redux imports
import store from './store/'
import { Provider } from 'react-redux'

import { withStyles } from '@material-ui/core/styles';
import 'styles/LeagueTableStyle.css'; // only needs to be imported once
import 'styles/CustomExpansionPanelStyles.css';
import { SnackbarProvider } from 'notistack';
require('dotenv').config()

const styles = theme => ({})

class App extends Component {

    constructor(props) {
        super(props);
    }

  render() {
    store.getState()
    {console.log('username', store.getState().username)}
    var logged_in = (store.getState().username !== null)

    // if logged in------------------------------------------------------------------------------------------------------------
    if(logged_in){
        return(
            <Provider store={store}>
                <SnackbarProvider maxSnack={3}>
                    <BrowserRouter>
                        <div>
                            <SideBar logged_in={logged_in} drawerWidth={'230px'}/>
                            <div className="App" style={{marginLeft:'240px', marginRight:'240px', minWidth:'450px', paddingLeft:'10px', marginTop:'60px', paddingTop:'0px'}}>
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                                <NavBar />
                                <Switch>
                                    <Route path="/Favorites" component={FavoritesPage}/>
                                    <Route path="/LeagueInfo" component={LeagueTablePage}/>
                                    <Route path="/MatchInfo" component={MatchPage}/>
                                    <Route path="/" component={Page1} />
                                </Switch>
                            </div>
                        </div>
                    </BrowserRouter>
                </SnackbarProvider>
            </Provider>
        )

    // if not logged in--------------------------------------------------------------------------------------------------------
    }else{
        return(
            <Provider store={store}>
                <SnackbarProvider maxSnack={3}>
                    <BrowserRouter>
                        <div>
                            <div className="App" style={{marginTop:'60px', paddingTop:'0px'}}>
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                                <NavBar />
                                <Switch>
                                    <Route path="/CreateAccount" component={CreateAccount}/>
                                    <Route path="/LoginPage" component={LoginPage}/>
                                    <Route path="/" component={LoginPage} />
                                </Switch>
                            </div>
                        </div>
                    </BrowserRouter>
                </SnackbarProvider>
            </Provider>
        )
    }
    //-------------------------------------------------------------------------------------------------------------------------
  }
}

export default App;
