import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import {getFavoriteTeamState, getFavoriteLeagueState, toggleTeamFavorite, toggleLeagueFavorite} from 'utils/Requests';


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
            this.props.enqueueSnackbar("removed " + this.props.identifier + " from favorites", {variant:'warning', autoHideDuration:700})
        }else{
            this.props.enqueueSnackbar("added " + this.props.identifier + " to favorites", {variant:'success', autoHideDuration:700})
        }
        this.setState({favorite: !this.state.favorite})
        this.props.toggleFavorite(this.props.identifier)
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
                    identifier={this.props.teamName}
                    toggleFavorite={(teamName) => {toggleTeamFavorite(this.props.username, teamName)}}
                    startFavorite={getFavoriteTeamState(this.props.username, this.props.teamName)}
                    />
            </div>
        )
    }
}

class AddToFavoritesLeague extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div>
                <AddToFavorites_
                    identifier={String(this.props.leagueId)}
                    toggleFavorite={(leagueId) => {toggleLeagueFavorite(this.props.username, String(leagueId))}}
                    startFavorite={getFavoriteLeagueState(this.props.username, String(this.props.leagueId))}
                    />
            </div>
        )
    }
}

const AddToFavoritesTeam_ = connect((state)=>state)(withSnackbar(AddToFavoritesTeam));
const AddToFavoritesLeague_ = connect((state)=>state)(withSnackbar(AddToFavoritesLeague));

export {AddToFavoritesTeam_ as AddToFavoritesTeam, AddToFavoritesLeague_ as AddToFavoritesLeague, AddToFavorites_}





AddToFavoritesTeam.propTypes = {
  teamName: PropTypes.string.isRequired,
};

AddToFavoritesLeague.propTypes = {
  leagueId: PropTypes.number.isRequired,
};

AddToFavorites.propTypes = {
  identifier: PropTypes.string.isRequired,
  // a function which toggle the favorite
  toggleFavorite: PropTypes.func.isRequired,
  // if true we start with item as a favorite
  startFavorite: PropTypes.bool,
};



