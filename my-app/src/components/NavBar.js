import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const NavBar_ = () => {
    return(
        <div>
        <AppBar position="fixed" style={{backgroundColor:'rgb(46, 130, 62)'}}>
            <Toolbar variant="dense">
                <Typography variant="title" color="inherit" style={{margin:'0px', padding:'0px'}}>
                    Soccer Scores
                </Typography>
            </Toolbar>
        </AppBar>
        </div>
    )
}

export default NavBar_;