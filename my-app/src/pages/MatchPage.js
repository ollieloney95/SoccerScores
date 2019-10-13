import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import MatchInfoTabs from 'components/MatchInfoTabs'
import MatchOverview from 'components/MatchOverview'
import MatchHeader from 'components/MatchHeader'

class MatchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            matchData: null,
        }
    };

    componentWillMount(){
        this.fetch_match_details(this.props.store.match_id)
    }

    componentWillReceiveProps (nextprops) {
        this.fetch_match_details(this.props.store.match_id)
    }

    fetch_match_details(match_id){
        console.log('fetch_match_details: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_match/" + match_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_match/" + match_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => this.setState({matchData: data}))
      }

  render() {
    if(!this.state.matchData){
        return(<div></div>)
    }
    return (
        <div>
            <MatchHeader matchData={this.state.matchData} />
            <MatchOverview matchData={this.state.matchData} />
            <MatchInfoTabs matchData={this.state.matchData} />
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