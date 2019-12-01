import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';


const fetchGet = async function(url){
    console.log('fetching: ', url)
    let response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }})
    let json = await response.json();
    return json
}

const toggleTeamFavorite = function(username, teamName){
    let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_FAVORITES  + "/toggleTeam/" + username + "/" + teamName + "/"
    return fetchGet(url)
}

const toggleLeagueFavorite = function(username, leagueId){
    let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_FAVORITES  + "/toggleLeague/" + username + "/" + leagueId + "/"
    return fetchGet(url)
}

const getFavorite = function(username){
     let url = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_FAVORITES  + "/getFavorites/" + username + "/"
     return fetchGet(url)
 }

const getFavoriteTeamState = function(username, teamName){
     return getFavorite(username).then(ret => {
        if(ret['teams'].includes(teamName)){
            return true
        }else{
            return false
        }
     })
}

const getFavoriteLeagueState = function(username, leagueId){
     return getFavorite(username).then(ret => {
        if(ret['leagues'].includes(leagueId)){
            return true
        }else{
            return false
        }
     })
}


class AddToFavorites extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            favorite: false,
            transition: false
        }
        if(props.startFavorite){
            props.startFavorite.then(ret => {
                this.setState({favorite: ret})
            })
        }
    }

    handleClick = (e) => {
        if(this.state.favorite){
            this.props.enqueueSnackbar("removed " + this.props.teamName + " from favorites", {variant:'warning', autoHideDuration:700})
        }else{
            this.props.enqueueSnackbar("added " + this.props.teamName + " to favorites", {variant:'success', autoHideDuration:700})
        }
        this.setState({favorite: !this.state.favorite})
        this.props.toggleFavorite(this.props.teamName)
    }

    handleMouseEnter = (e) => {
       this.setState({transition: true})
    }

    handleMouseLeave = (e) => {
       this.setState({transition: false})
    }

  render() {
    let starText
    if(this.state.transition){
        starText = this.state.favorite ? 'toGoldStar' : 'toBlackStar'
    }else{
        starText = this.state.favorite ? 'goldStar' : 'blackStar'
    }
    return (
      <div>
        <img
            height={'15px'}
            width={'15px'}
            src={"/images/icons/" + starText + ".svg"}
            alt={""}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            />
      </div>
    );
  }
}

const AddToFavorites_ = withSnackbar(AddToFavorites);

class AddToFavoritesTeam extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <AddToFavorites_
                    teamName={this.props.teamName}
                    toggleFavorite={(teamName) => {toggleTeamFavorite(this.props.username, teamName)}}
                    startFavorite={getFavoriteTeamState(this.props.username, this.props.teamName)}
                    />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state;
}

const AddToFavoritesTeam_ = connect(mapStateToProps)(withSnackbar(AddToFavoritesTeam));

export {AddToFavoritesTeam_ as AddToFavoritesTeam , AddToFavorites_}

AddToFavoritesTeam.propTypes = {
  teamName: PropTypes.string.isRequired,
};

AddToFavorites.propTypes = {
  teamName: PropTypes.string.isRequired,
  // a function which toggle the favorite
  toggleFavorite: PropTypes.func.isRequired,
  // if true we start with item as a favorite
  startFavorite: PropTypes.bool,
};



