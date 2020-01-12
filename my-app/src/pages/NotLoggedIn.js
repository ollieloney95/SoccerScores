import React, { Component } from 'react';
import NavBar from './components/NavBar'
import ClippedDrawer from './components/ClippedDrawer'
import 'typeface-roboto'
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import HomePage from './pages/HomePage'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import LoginPage from './pages/LoginPage'
import {serialize,deserialize} from './c.js'
import store from './store/'
import { Provider } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import 'node-q'
import { PersistGate } from 'redux-persist/lib/integration/react';
import CreateAccount from './pages/account/CreateAccount'
import { persistor } from './store';

const styles = theme => ({})

class App extends Component {

    constructor(props) {
        super(props);
    }

    handleData(data) {
      let result = JSON.parse(data);
      {console.log('I was triggered during handle data')}
      this.setState({count: this.state.count + result.movement});
    }

  render() {
    console.log("gloabl us:  ",store.getState().username)
    if(store.getState().username == null){
        return (
          <Provider store={store}>
              <PersistGate persistor={persistor}>
                  <BrowserRouter>
                      <div className="App">
                            <NavBar />
                            <Switch>
                                <Route path="/CreateAccount" component={CreateAccount} />
                                <Route path="/LoginPage" component={LoginPage} />
                                <Route path="/" component={LoginPage} />
                            </Switch>
                      </div>
                  </BrowserRouter>
              </PersistGate>
          </Provider>
        )
    }

    return (
      <Provider store={store}>
          <BrowserRouter>
              <div className="App">
                  <NavBar />
                  <ClippedDrawer />
                    <Switch>
                        <Route path="/CreateAccount" component={CreateAccount} />
                        <Route path="/LoginPage" component={LoginPage} />
                        <Route path="/Page1" component={Page1}/>
                        <Route path="/Page2" component={Page2}/>
                    </Switch>

              </div>
          </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
