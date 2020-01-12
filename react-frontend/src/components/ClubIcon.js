import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ClubIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick = (e) => {
        if(this.props.blockLink){
            return
        }
        this.props.changeTeam(this.props.clubName)
        window.location.href='/TeamPage'
    }

  render() {
    return (
      <div>
        <img
            height={this.props.height ? this.props.height : '25px'}
            width={this.props.width ? this.props.width : '25px'}
            src={("").concat("/images/ClubLogos/",this.props.clubName,".png")}
            alt={""}
            onClick={this.handleClick}
            />
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


export default connect(mapStateToProps, mapDispatchToProps)(ClubIcon);


ClubIcon.propTypes = {
  clubName: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  blockLink: PropTypes.bool
};