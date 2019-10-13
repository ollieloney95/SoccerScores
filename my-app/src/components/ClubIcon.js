import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ClubIcon extends React.Component {

    constructor(props) {
        super(props);
    }

  render() {
    return (
      <div>
        <img
            height='25px'
            width='25px'
            src={("").concat("/images/ClubLogos/",this.props.country_name,"/",this.props.clubName,".png")}
            alt={""}
            />
      </div>
    );
  }
}

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps)(ClubIcon);

ClubIcon.propTypes = {
  country_name: PropTypes.string.isRequired,
  clubName: PropTypes.string.isRequired,
};