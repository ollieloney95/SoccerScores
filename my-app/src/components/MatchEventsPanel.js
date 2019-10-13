import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HorizontalBar from 'components/HorizontalBar';
import Paper from '@material-ui/core/Paper';
import EventIcon from 'components/EventIcon'


export default class MatchEventsPanel extends React.Component {

    constructor(props) {
        super(props);
    }

    format_events = (goalScorers, cards) => {
        let events = {} //minutes to events, events is a list,
        // a single events is a list of [minute:int, home:bool, eventDisplay:component, type:str]

        // go through goalscorers
        for(let i=0;i<goalScorers.length;i++){
            let mins = parseInt(goalScorers[i]['time'])
            let isHome = goalScorers[i]['away_scorer']==""?true:false
            let eventDisplay
            if(isHome){
                eventDisplay = (<div>
                                    <p style={{display:'inline-block', margin:'0px 5px'}}>
                                        {mins}
                                    </p>
                                    <EventIcon event={'goal'}/>
                                    <p style={{display:'inline-block', margin:'0px 5px'}}>
                                        {goalScorers[i]['home_scorer']}
                                    </p>
                               </div>)
            }else{
                eventDisplay = (<div>
                                    <p style={{display:'inline-block', margin:'0px 5px'}}>
                                        {goalScorers[i]['away_scorer']}
                                    </p>
                                    <EventIcon event={'goal'} />
                                    <p style={{display:'inline-block', margin:'0px 5px'}}>
                                        {mins}
                                    </p>
                               </div>)
            }
            let event = [mins, isHome, eventDisplay, 'goal']
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
            let eventDisplay
            if(isHome){
                eventDisplay = (<div>
                                    <p style={{display:'inline-block', margin:'0px 5px'}}>
                                        {mins}
                                    </p>
                                    <EventIcon event={cards[i]['card']} />
                                    <p style={{display:'inline-block', margin:'0px 5px'}}>
                                        {cards[i]['home_fault']}
                                    </p>
                               </div>)
            }else{
                eventDisplay = (<div>
                                   <p style={{display:'inline-block', margin:'0px 5px'}}>
                                       {cards[i]['away_fault']}
                                   </p>
                                   <EventIcon event={cards[i]['card']} />
                                   <p style={{display:'inline-block', margin:'0px 5px'}}>
                                       {mins}
                                   </p>
                              </div>)
            }
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
        console.log('events', events)

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
        events = this.events_to_components(this.format_events(this.props.goalScorers, this.props.cards))
    }
    return (
      <Paper>
        {events}
      </Paper>
    );
  }
}

MatchEventsPanel.propTypes = {
  goalScorers: PropTypes.array.isRequired,
  cards: PropTypes.array.isRequired
}