import React, { Component } from 'react';
import { connect } from 'react-redux';

class ClubIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              clubString: this.props.clubName,
              countryString: this.props.country_name,
          }
    }

  render() {
    return (
      <div>
        <img
            height='25px'
            width='25px'
            src={("").concat("/images/ClubLogos/",this.state.countryString,"/",this.state.clubString,".png")}
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