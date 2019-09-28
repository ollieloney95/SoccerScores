import React, { Component } from 'react';
import {CountryConfig} from 'configs/IconConfig.js';

class CountryIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              countryString: this.getImageFromId(this.props.country_id),
          }
    }

    getImageFromId(id){
        console.log('CountryConfig', CountryConfig)
        return(CountryConfig['countryList'][id])
    }

  render() {
    return (
      <div>
        <img src={("").concat("/images/Countries/", this.state.countryString, ".png")} />
      </div>
    );
  }
}

export default CountryIcon;