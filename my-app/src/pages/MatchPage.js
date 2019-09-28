import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import AppBar from '@material-ui/core/AppBar';


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
        console.log('fetch_match_details: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + match_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_match/" + match_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ matchData: data[Object.keys(data)[0]]}); console.log('data in fetch ', data)});
      }


      renderObj = (obj) => {
        console.log(obj)
        return(
        Object.keys(obj).map((k) => {
            console.log('k', k)
            return (
              <div>
                {obj[k]}
              </div>
            )
        }))
      }

  render() {
    if(!this.state.matchData){
        return(<div></div>)
    }
    return (
        <div>
          <AppBar position="static"  color="default" style={{width:'100%'}}>
            <h4 style={{display:'inline', height:'10px', textAlign:'left', margin:'0px', padding:'10px'}}>
                {console.log('this.state.matchData', this.state.matchData)}
              {this.state.matchData['match_hometeam_name'] + ' vs ' + this.state.matchData['match_awayteam_name']}
            </h4>
          </AppBar>
            {'below'}
            {this.renderObj(this.state.matchData)}
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