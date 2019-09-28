import React, { Component } from 'react';
import { Column, Table } from 'react-virtualized';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import ClubIcon from './ClubIcon'
import {onGridSizeChanged} from 'utils/AGGridUtils'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


class LeagueTable extends React.Component {

    boldCellRenderer({
            cellData,
            columnData,
            columnIndex,
            dataKey,
            isScrolling,
            rowData,
            rowIndex,
          }
          ) {
            return (
              <div>
                <b>{cellData}</b>
              </div>
            );
    }

    constructor(props) {
        super(props);
        this.state = {
                  standingsDataRaw: null,
                  standingsDataFormatted: null,
                  country_name: this.props.country_name,
                  columnDefs: [{
                          headerName: "Pos", field: "position", width: 60, pinned: 'left', cellStyle: {textAlign: 'right'}
                        }, {
                          headerName: "Team", field: "team", width: 100, pinned: 'left', cellStyle: {textAlign: 'right'}
                        }, {
                          headerName: "Club", field: "team", width: 60, cellRenderer:'clubIconCellRenderer', sortable: false
                        }, {
                          headerName: "GP", field: "gamesPlayed", width: 50
                        }, {
                          headerName: "Won", field: "won", width: 60
                        }, {
                          headerName: "Drawn", field: "drawn", width: 60
                        }, {
                          headerName: "Lost", field: "lost", width: 60
                        }, {
                          headerName: "GF", field: "goalsFor", width: 50
                        }, {
                          headerName: "GA", field: "goalsAgainst", width: 50
                        }, {
                          headerName: "GD", field: "gd", width: 50
                        }, {
                          headerName: "Points", field: "points", width: 70, sort:'desc'
                        }],
                  rowData: [],
                  defaultColDef: {
                          resizable: true,
                          sortable: true
                      },
              }
    }

    clubIconCellRenderer = (cellData) =>{
            return (
              <div>
                <ClubIcon clubName={cellData} country_name={this.props.country_name}/>
              </div>
            );
    }

    fetch_get_standings(league_id){
            console.log('fetch_get_standings: ', process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_league_standings_db/" + league_id)
            fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT_MIDDLE  + "/get_league_standings_db/" + league_id, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  }})
                  .then(response => response.json())
                  .then(data => {this.setState({ standingsDataRaw: data }); this.setupStandingData();});
          }

    clubIconCellRenderer = (params) => {
        return(<ClubIcon clubName={params.value} country_name={this.props.country_name}/>)
    }


    setupStandingData() {
      if(this.state.standingsDataRaw === null){
        return;
      }
      var listData = []
      for(var key in this.state.standingsDataRaw){
        listData.push({
            'position': parseInt(this.state.standingsDataRaw[key]['overall_league_position']),
            'team': this.state.standingsDataRaw[key]['team_name'],
            'clubIcon': this.state.standingsDataRaw[key]['team_name'],
            'gamesPlayed': parseInt(this.state.standingsDataRaw[key]['overall_league_payed']),
            'won': parseInt(this.state.standingsDataRaw[key]['overall_league_W']),
            'drawn': parseInt(this.state.standingsDataRaw[key]['overall_league_D']),
            'lost': parseInt(this.state.standingsDataRaw[key]['overall_league_L']),
            'goalsFor': parseInt(this.state.standingsDataRaw[key]['overall_league_GF']),
            'goalsAgainst': parseInt(this.state.standingsDataRaw[key]['overall_league_GA']),
            'gd': parseInt(this.state.standingsDataRaw[key]['overall_league_GF']) - parseInt(this.state.standingsDataRaw[key]['overall_league_GA']),
            'points': parseInt(this.state.standingsDataRaw[key]['overall_league_PTS'])})
      }
      this.setState({standingsDataFormatted: listData});
      return;
    }

    componentWillMount(){
        this.fetch_get_standings(this.props.league_id)
        this.setupStandingData();
    }

    componentWillReceiveProps (nextprops) {
        this.fetch_get_standings(nextprops.league_id)
    }

    clubIcon_ = function(params) {
        return <span>hh</span>
    }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{width:'100%', height:'660px', marginTop:'10px'}}>
        <AgGridReact
                  columnDefs={this.state.columnDefs}
                  rowData={this.state.standingsDataFormatted}
                  defaultColDef={this.state.defaultColDef}
                  components={{'clubIcon': this.clubIcon_}}
                  suppressColumnVirtualisation={true}
                  frameworkComponents={{clubIconCellRenderer:this.clubIconCellRenderer}}
                  onGridSizeChanged={onGridSizeChanged}
                  >
        </AgGridReact>
      </div>
    );
  }
}

function mapStateToProps(store) {
    return {store};
}

export default connect(mapStateToProps)(LeagueTable);