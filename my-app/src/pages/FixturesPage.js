import React, { Component } from 'react';
import Fixture from 'components/Fixture'
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';


class FixturesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              fixturesByDay: null,
          }
    };

    componentWillMount(){
        this.fetch_get_fixtures(this.props.league_id)
    }

    componentWillReceiveProps (nextprops) {
        this.fetch_get_fixtures(nextprops.league_id)
    }

    fetch_get_fixtures(league_id){
        console.log('fetch_get_fixtures: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + league_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_fixtures/" + league_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ fixturesByDay: this.formatFixturesData(data)}); console.log('data in fetch ', data)});
      }


      formatDate = (date_ts) =>{
          let date = new Date(parseInt(date_ts) * 1000)
          let day = date.toLocaleString('en-us', {  weekday: 'short' })
          let dayOfMonth = date.getDate()
          let month = date.toLocaleString('en-us', {  month: 'short' })
          return(day + ' ' + dayOfMonth + ' ' + month)
      }

    formatFixturesData = (resultsRaw) => {
        let fixturesByDay = {}
        for (var match_id in resultsRaw) {
          let date = new Date(parseInt(resultsRaw[match_id].match_date) * 1000)
          let day = date.toLocaleDateString('en-us')
          if(!(day in fixturesByDay)){
            fixturesByDay[day] = [resultsRaw[match_id]]
          }else{
            fixturesByDay[day].push(resultsRaw[match_id])
          }
        }
        return(fixturesByDay)
    }

    formatDayComponent = (fixturesForDay) => {
        let component = []
        for(let i =0;i<fixturesForDay.length;i++){
            component.push(<Fixture
                               home_team = {fixturesForDay[i]['match_hometeam_name']}
                               away_team = {fixturesForDay[i]['match_awayteam_name']}
                               match_date = {fixturesForDay[i]['match_date']}
                               match_time = {fixturesForDay[i]['match_time']}
                               />)
             component.push(<Divider variant="middle"/>)
        }
        return(<Paper
                    style={{marginBottom:'30px', textAlign:'left'}}>
                    <p style={{margin:'5px', color:"rgb(150, 150, 150)", fontSize:'90%'}}>
                        {this.formatDate(fixturesForDay[0]['match_date'])}
                    </p>
                    {component}
               </Paper>)
    }

    formatAggregateComponent = (fixturesByDay) => {

        if(!fixturesByDay){return}
        let dates_str = Object.keys(fixturesByDay)
        let dates = []
        for(let i=0;i<dates_str.length;i++){
            dates.push(new Date(dates_str[i]))
        }
        dates.sort(function(a,b){
          return new Date(b.date) - new Date(a.date);
        });
        let component = []
        for(let i=0;i<dates.length;i++){
            let date = dates[i].toLocaleDateString('en-us')
            component.push(this.formatDayComponent(fixturesByDay[date]))

        }
        return(component)
    }

  render() {
    return (
      <div>
            <div style={{height:'10px'}}>
            </div>
            {this.formatAggregateComponent(this.state.fixturesByDay)}
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

export default connect(mapStateToProps, mapDispatchToProps)(FixturesPage);