import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';

class AddToFavorites extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            favorite: false,
            transition: false
        }
    }

    handleClick = (e) => {
        if(this.state.favorite){
            this.props.enqueueSnackbar("removed " + this.props.teamName + " from favorites", {variant:'warning', autoHideDuration:700})
        }else{
            this.props.enqueueSnackbar("added " + this.props.teamName + " to favorites", {variant:'success', autoHideDuration:700})
        }
        this.setState({favorite: !this.state.favorite})
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

export default withSnackbar(AddToFavorites)


AddToFavorites.propTypes = {
  teamName: PropTypes.string.isRequired,
};