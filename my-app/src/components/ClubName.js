import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ClubName extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        this.props.changeTeam(this.props.clubName)
        window.location.href='/TeamPage'
    }

  render() {
    return (
      <div onClick={this.handleClick}>
        {this.props.clubName}
      </div>
    );
  }
}

function mapStateToProps(store) {
    return {store};
}

function mapDispatchToProps(dispatch) {
    return {
        changeTeam: (teamName) => {
            console.log("setting global team as : ", teamName);
            const action = { type: 'set_team', teamName: teamName};
            dispatch(action);
        }
    }
 }


export default connect(mapStateToProps, mapDispatchToProps)(ClubName);


ClubName.propTypes = {
  clubName: PropTypes.string.isRequired,
};