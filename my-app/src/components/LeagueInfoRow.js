import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import LeagueIcon from 'components/ClubIcon';
import { connect, Provider } from 'react-redux';


class TeamHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shadow: 0
        }
    }

    onMouseOver = () => this.setState({ shadow: 4 });
    onMouseOut = () => this.setState({ shadow: 0 });

    handleSelect = (e) => {
       this.props.changeLeagueId(this.props.teamName)
       window.location.href='/LeagueInfo'
    }

  render() {
    return (
      <Paper
            onClick={this.handleSelect}
            elevation={this.state.shadow}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseOut}
            style={{height:'40px', width:'100%'}}>

        <div style={{float:'left', margin:'3px 0px'}}>
            <LeagueIcon
                height={34}
                width={34}
                leagueId={this.props.leagueId}
            />
        </div>
        <b style={{float:'left', fontSize:16, margin:'10px 0px'}}>
            {this.props.leagueId}
        </b>
      </Paper>
    );
  }
}

function mapDispatchToProps(dispatch) {
        return {
            changeLeagueId: (lid, lnm, cid, cnm) => {
                console.log("setting global league_id as : ", lid, lnm);
                const action = { type: 'set_league_id', league_id: lid, league_name: lnm, country_id: cid, country_name: cnm};
                dispatch(action);
            }
        }
     }

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamHeader);


TeamHeader.propTypes = {
  leagueId: PropTypes.string.isRequired,
};