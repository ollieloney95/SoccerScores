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
            height={this.props.height ? this.props.height : '25px'}
            width={this.props.width ? this.props.width : '25px'}
            src={("").concat("/images/ClubLogos/",this.props.clubName,".png")}
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
  clubName: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};