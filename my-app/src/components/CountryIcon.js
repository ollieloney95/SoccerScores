import React, { Component } from 'react';
import {CountryConfig} from 'configs/IconConfig.js';
import PropTypes from 'prop-types';

class CountryIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countryName: 'default'
        }
    }

    fetch_country_name(country_id){
        console.log('country_id', country_id)
        let path = process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_name_from_country_id/" + country_id + "/"
        console.log('fetch_country_name: ', path)
        fetch(path, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {console.log('data', data) ; this.setState({countryName: data})})
    }

    componentWillMount(){
        this.fetch_country_name(this.props.country_id)
    }

  render() {
    return (
      <div>
        <img src={("").concat("/images/Countries/", this.state.countryName, ".png")} />
      </div>
    );
  }
}

export default CountryIcon;

CountryIcon.propTypes = {
  country_id: PropTypes.number.isRequired
}