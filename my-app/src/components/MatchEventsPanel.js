import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HorizontalBar from 'components/HorizontalBar';
import Paper from '@material-ui/core/Paper';
import EventIcon from 'components/EventIcon'


class EventDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let minsElement = (<p style={{display:'inline-block', margin:'0px 5px'}}>
                              {this.props.mins}
                           </p>)

        let textElement = (<p style={{display:'inline-block', margin:'0px 5px'}}>
                               {this.props.text}
                           </p>)

        return (
        <div>
            {this.props.home ? minsElement : textElement}
            <EventIcon event={this.props.event}/>
            {this.props.home ? textElement : minsElement}
        </div>
        );
    }
}


export default class MatchEventsPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    format_events = (goalScorers, cards, substitutions) => {
        let events = {} //minutes to events, events is a list,
        // a single events is a list of [minute:int, home:bool, eventDisplay:component, type:str]


        // go through goalscorers
        for(let i=0;i<goalScorers.length;i++){
            let mins = parseInt(goalScorers[i]['time'])
            let isHome = goalScorers[i]['away_scorer'] == "" ? true : false
            let scorer = isHome ? goalScorers[i]['home_scorer'] : goalScorers[i]['away_scorer']
            let eventDisplay = <EventDisplay home={isHome} event={'goal'} text={scorer} mins={mins} />

            let event = [mins, isHome, eventDisplay, 'goal']
            if(mins in Object.keys(events)){
                events[mins].push(event)
            }else{
                events[mins] = [event]
            }
        }


        // go through subs
        for(let sub of substitutions['home']){
            let mins = parseInt(sub['time'])
            let eventDisplay = <EventDisplay home={true} event={'substitution'} text={sub['substitution']} mins={mins} />
            let event = [parseInt(sub['time']), true, eventDisplay, sub['substitution']]
            if(mins in Object.keys(events)){
                events[mins].push(event)
            }else{
                events[mins] = [event]
            }
        }
        for(let sub of substitutions['away']){
            let mins = parseInt(sub['time'])
            let eventDisplay = <EventDisplay home={false} event={'substitution'} text={sub['substitution']} mins={mins} />
            let event = [mins, false, eventDisplay, sub['substitution']]
            if(mins in Object.keys(events)){
                events[mins].push(event)
            }else{
                events[mins] = [event]
            }
        }



        // go through cards
        for(let i=0;i<cards.length;i++){
            let mins = parseInt(cards[i]['time'])
            let isHome = cards[i]['away_fault']==""?true:false
            let text = isHome ? cards[i]['home_fault'] : cards[i]['away_fault']
            let eventDisplay = <EventDisplay home={isHome} event={cards[i]['card']} text={text} mins={mins} />
            let event = [mins, isHome, eventDisplay, cards[i]['card']]
            if(mins in Object.keys(events)){
                events[mins].push(event)
            }else{
                events[mins] = [event]
            }
        }
        return(events)
    }


    events_to_components = (events) => {
        let mins = Object.keys(events)
        let eventComponents = []

        mins.forEach(function(min) {
          for(let j=0;j<events[min].length;j++){
              let event = events[min][j]
              let eventComponent = (
                <div style={{display:'block', height:'30px'}}>
                    <b style={{float:event[1]?'left':'right', fontSize:'12px'}}>
                        {event[2]}
                    </b>
                </div>
              )
              eventComponents.push(eventComponent)
          }
        })

        console.log(eventComponents)
        return(eventComponents)
    }


  render() {
    let events
    if(this.props.goalScorers && this.props.cards){
        events = this.events_to_components(this.format_events(this.props.goalScorers, this.props.cards, this.props.substitutions))
    }
    return (
      <Paper style={{width:'60%', margin:'auto'}}>
        {events}
      </Paper>
    );
  }
}

MatchEventsPanel.propTypes = {
  goalScorers: PropTypes.array.isRequired,
  cards: PropTypes.array.isRequired,
  substitutions: PropTypes.array.isRequired
}

EventDisplay.propTypes = {
  event: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  mins: PropTypes.number.isRequired,
  home: PropTypes.bool.isRequired,
}