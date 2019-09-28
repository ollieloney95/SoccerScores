import React, { Component } from 'react';
import Results from 'components/Result'
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class MatchesByDay extends React.Component {

    constructor(props) {
        super(props);
    };

    formatDate = (date_ts) =>{
        let date = new Date(parseInt(date_ts) * 1000)
        let day = date.toLocaleString('en-us', {  weekday: 'short' })
        let dayOfMonth = date.getDate()
        let month = date.toLocaleString('en-us', {  month: 'short' })
        return(day + ' ' + dayOfMonth + ' ' + month)
    }

    formatDayComponent = (resultsForDay) => {
        let component = []
        for(let i =0;i<resultsForDay.length;i++){
            component.push(<Results
                                matchInfo={resultsForDay[i]}
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

    formatAggregateComponent = (matchesByDay) => {

        if(!matchesByDay){return}
        let dates_str = Object.keys(matchesByDay)
        var dates = new Array()
        for(let i=0;i<dates_str.length;i++){
            dates.push(new Date(dates_str[i]))
        }
        if(this.props.sortAscending){
            dates.sort(function(a,b){
                return  b.getTime() - a.getTime();
            });
        }else{
            dates.sort(function(a,b){
                return a.getTime() - b.getTime();
            });
        }


        let component = []
        for(let i=0;i<dates.length;i++){
            let date = dates[i].toLocaleDateString('en-us')
            component.push(this.formatDayComponent(matchesByDay[date]))

        }
        return(component)
    }

  render() {
    return (
      <div>
            <div style={{height:'10px'}}>
            </div>
            {this.formatAggregateComponent(this.props.matchesByDay)}
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchesByDay);

MatchesByDay.propTypes = {
  sortAscending: PropTypes.bool.isRequired
};