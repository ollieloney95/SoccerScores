import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';


const styles = theme => ({

 });




class Page1 extends Component {

    constructor(props) {
          super(props);
          this.state = {
              state1: null,
          }
      };


  render() {
  const { classes } = this.props
    if(this.props.username == null){
        return (
            <div>
                <p>not logged in</p>
            </div>
        )
    }
    return (

      <div className={classes.contents} >
        <div>
            <Paper elevation={1}>
                <Typography variant="headline" component="h3">
                    Default page
                </Typography>
                <Typography component="p">
                    <p>username of logged in person is {this.props.username}</p>
                </Typography>
            </Paper>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
        return {}
     }

function mapStateToProps(state) {
    console.log('mapStateToProps', state)
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Page1));
