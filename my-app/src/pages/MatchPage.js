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

    formatDate = (date_ts) =>{    //todo this is repeated
        let date = new Date(parseInt(date_ts) * 1000)
        let day = date.toLocaleString('en-us', {  weekday: 'short' })
        let dayOfMonth = date.getDate()
        let month = date.toLocaleString('en-us', {  month: 'short' })
        return(day + ' ' + dayOfMonth + ' ' + month)
    }

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
              .then(data => {this.setState({matchData: data}); console.log('data in fetch ', data)});
      }


      renderObj = (obj) => {
        console.log(obj)
        return(
        Object.keys(obj).map((k) => {
            console.log('k', k)
            return (
              <div>
                {k}
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
            <div id='banner' style={{position:'relative'}}>
                <img
                        width='100%'
                        src={("/images/bannerFootballCrop.jpg")}
                        alt={""}
                    />
                <div id='banner-left' style={{position:'absolute', height:'100px', width:'40%', textAlign:'centre', top:'5%', left:'10px'}}>
                    <h3 style={{ color:"rgb(255, 255, 255)", margin:'0px'}}>
                        {this.state.matchData['match_hometeam_name'] + ' vs ' + this.state.matchData['match_awayteam_name']}
                    </h3>
                    <h4 style={{color:"rgb(255, 255, 255)", margin:'0px'}}>
                        {this.state.matchData['match_status']}
                    </h4>
                </div>
                <div id='banner-right' style={{position:'absolute', height:'100px', width:'40%', textAlign:'right', top:'5%', right:'10px'}}>
                    <h3 style={{color:"rgb(255, 255, 255)", margin:'0px'}}>
                        {this.state.matchData['match_time']}
                    </h3>
                    <h3 style={{color:"rgb(255, 255, 255)", margin:'0px'}}>
                        {this.formatDate(this.state.matchData['match_date'])}
                    </h3>
                </div>

            </div>

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