import React, {component} from 'react';
import '../App.css';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { routerMiddleware, push } from 'react-router-redux'
import { Redirect } from "react-router-dom";

const initialState = {
    PopUp_open: false,
    PopUp_text: "helo bello",
    username: null,
    league_id: null,
};

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch(e) {
    console.log(e)
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch(e) {
    console.log(e)
    return undefined
  }
}

const persistedState = loadFromLocalStorage()

const reducer = (state = initialState, action) => {
    console.log('reducer running',action);

    switch (action.type) {
        case 'open_popup':
            return Object.assign({}, state, { PopUp_open: true,
                                              PopUp_text: action.message});
        case 'close_popup':
            return Object.assign({}, state, {PopUp_open: false});

        case 'login':
            console.log("in store set for: " + action.username)
            window.location.reload()
            return Object.assign({}, state, {username: action.username});

        case 'set_league_id':
            console.log("in store set league_id as: " + action.league_id + action.league_name)
            return Object.assign({}, state, {league_id: action.league_id, league_name: action.league_name, country_name: action.country_name});

        case 'set_match_id':
            console.log("in store set match_id as: " + action.match_id)
            return Object.assign({}, state, {match_id: action.match_id});

        case 'set_team':
            console.log("in store set team as: " + action.teamName)
            return Object.assign({}, state, {teamName: action.teamName});

        case 'logout':
            console.log("in store for logout: ")
            Object.assign({}, state, {username: null})
            window.location.reload()
            return Object.assign({}, state, {username: null});

        case '':
        default:
            return state;
    }
}

const store = createStore(
  reducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)




//const store = createStore(reducer);

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store;