import React, { Component } from 'react';
import Results from 'components/Result'
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';


class ResultsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              resultsByDay: null,
          }
    };

    componentWillMount(){
        this.fetch_get_results(this.props.league_id)
    }

    componentWillReceiveProps (nextprops) {
        if(this.props.league_id === nextprops.league_id){
            return
        }
        this.fetch_get_results(nextprops.league_id)
    }

    fetch_get_results(league_id){
        console.log('fetch_get_results: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_results/" + league_id)
        fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_results/" + league_id, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }})
              .then(response => response.json())
              .then(data => {this.setState({ resultsByDay: this.formatResultsData(data)}); console.log('data in fetch ', data)});
      }


      formatDate = (date_ts) =>{
              let date = new Date(parseInt(date_ts) * 1000)
              let day = date.toLocaleString('en-us', {  weekday: 'short' })
              let dayOfMonth = date.getDate()
              let month = date.toLocaleString('en-us', {  month: 'short' })
              return(day + ' ' + dayOfMonth + ' ' + month)
          }

    formatResultsData = (resultsRaw) => {
        let resultsByDay = {}
        for (var match_id in resultsRaw) {
          let date = new Date(parseInt(resultsRaw[match_id].match_date) * 1000)
          let day = date.toLocaleDateString('en-us')
          if(!(day in resultsByDay)){
            resultsByDay[day] = [resultsRaw[match_id]]
          }else{
            resultsByDay[day].push(resultsRaw[match_id])
          }
        }

        return(resultsByDay)
    }

    formatDayComponent = (resultsForDay) => {
        let component = []
        for(let i =0;i<resultsForDay.length;i++){
            component.push(<Results
                               match_id = {resultsForDay[i]['match_id']}
                               home_team = {resultsForDay[i]['match_hometeam_name']}
                               away_team = {resultsForDay[i]['match_awayteam_name']}
                               home_score = {resultsForDay[i]['match_hometeam_score']}
                               away_score = {resultsForDay[i]['match_awayteam_score']}
                               match_date = {resultsForDay[i]['match_date']}
                               match_time = {resultsForDay[i]['match_time']}
                               />)
             component.push(<Divider variant="middle"/>)
        }
        return(<Paper
                    style={{marginBottom:'30px', textAlign:'left'}}>
                    <p style={{margin:'5px', color:"rgb(150, 150, 150)", fontSize:'90%'}}>
                        {this.formatDate(resultsForDay[0]['match_date'])}
                    </p>
                    {component}
               </Paper>)
    }

    formatAggregateComponent = (resultsByDay) => {

        if(!resultsByDay){return}
        let dates_str = Object.keys(resultsByDay)
        var dates = new Array()
        for(let i=0;i<dates_str.length;i++){
            dates.push(new Date(dates_str[i]))
        }
        dates.sort(function(a,b){
          return  b.getTime() - a.getTime();
        });
        let component = []
        for(let i=0;i<dates.length;i++){
            let date = dates[i].toLocaleDateString('en-us')
            component.push(this.formatDayComponent(resultsByDay[date]))

        }
        return(component)
    }

  render() {
    return (
      <div>
            <div style={{height:'10px'}}>
            </div>
            {this.formatAggregateComponent(this.state.resultsByDay)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPage);