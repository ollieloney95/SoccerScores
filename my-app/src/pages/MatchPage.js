import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'


class MatchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          matchData: null,
          matchData: null,
        }
    };

    componentWillMount(){
        this.fetch_match_details(this.props.store.match_id)
    }

    fetch_match_details(match_id){
        console.log('fetch_match_details: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + match_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + match_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ matchData: data}); console.log('data in fetch ', data)});
      }


  render() {
    return (
      <div>
        {this.props.store.match_id}
        {this.state.matchData}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
        return {}
     }

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchPage);