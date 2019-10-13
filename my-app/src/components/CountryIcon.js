import React, { Component } from 'react';
import {CountryConfig} from 'configs/IconConfig.js';
import PropTypes from 'prop-types';

class CountryIcon extends React.Component {

    constructor(props) {
        super(props);
    }

    getImageFromId(id){
        console.log('CountryConfig', CountryConfig)
        return(CountryConfig['countryList'][id])
    }

  render() {
    return (
      <div>
        <img src={("").concat("/images/Countries/", this.getImageFromId(this.props.country_id), ".png")} />
      </div>
    );
  }
}

export default CountryIcon;

CountryIcon.propTypes = {
  country_id: PropTypes.number.isRequired
}