import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  contents: {
    margin: 'auto',
    flexGrow: 0.8,
    zIndex: 1,
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    marginTop: '50px',
    alignItems: 'center',
    justifyContent: 'center',
  }
 });

class HomePage extends Component {

  render() {
  const { classes } = this.props
    return (
      <div className={classes.contents} >
        <Paper elevation={1}>
            <Typography variant="headline" component="h3">
                This is the home page lad.
            </Typography>
            <Typography component="p">
                Paper can be used to build surface or other elements for your application.
            </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);