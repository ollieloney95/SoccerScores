import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lineup from 'components/Lineup'


export default class FullPitch extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return(
            <div style={{position: 'relative'}}>
                <img
                    src='/images/footballPitch.svg'
                    style={{position:'absolute',
                            width:'80%',
                            right: '10%',
                            zIndex: '-1'}}
                    />
                <div style={{position:'absolute', width:'100%'}}>
                    <div style={{width:'100%', marginTop:'5%'}}>
                        <Lineup
                            lineup={this.props.matchData['lineup']['home']}
                            formation={this.props.matchData['match_hometeam_system']}
                        />
                    </div>
                    <div style={{width:'100%', marginTop:'0%', bottom:'0px'}}>
                        <Lineup
                            lineup={this.props.matchData['lineup']['home']}
                            formation={this.props.matchData['match_hometeam_system']}
                            reversed={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

FullPitch.propTypes = {
    matchData: PropTypes.object.isRequired
}