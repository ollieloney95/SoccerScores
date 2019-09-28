import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import { withSnackbar } from 'notistack';
import {AvatarConfig} from 'configs/IconConfig'

class LoginPage extends Component {

  constructor(props) {
      super(props);
      this.state = {
          username_text: "",
          password_text: "",
          username_error: false,
          password_error: false,
          username_helper_text: "",
          password_helper_text: "",
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
  };

  handleChange(event) {
       this.setState({[event.target.name]: event.target.value});
     }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.handleClick(event)
    }
  }

  handleClick(event) {
      var check_user = -1;
      this.setState({
            password_helper_text: "",
            username_helper_text: "",
            password_error: false,
            username_error: false
        });
      fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT  + "/login/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          username: this.state.username_text,
          password: this.state.password_text
        })
      })
      .then((response) => response.json())
      .then((responseText) => {
        check_user = parseInt(responseText["user_check"]);
        if (check_user === 0){
          this.props.enqueueSnackbar("incorrect username", {variant:'error'})
          this.setState({username_helper_text: "username does not exist"});
          this.setState({username_error: true});
        }else if (check_user === 1){
          this.props.enqueueSnackbar("incorrect password", {variant:'warning'})
          this.setState({password_helper_text: "incorrect password"});
          this.setState({password_error: true});
        }else if (check_user === 2){
            this.props.globalLoginDetails(this.state.username_text)
          this.props.enqueueSnackbar("Logged in " + this.state.username_text, {variant:'success'})
          this.props.history.push('/Page1')
        }else{
            this.props.onPopUp("error with user check");
            this.props.enqueueSnackbar("error with user check", {variant:'error'})
        }
      })
      .catch((error) => {
          console.error(error);
      });
    }

  render() {
    return (
      <div
        style={{display:'block',
                margin:'20px auto',
                width:"450px",
                overflow:'hidden',
                marginTop:'70px',
                }}>
        <Paper
            elevation={1}
            style={{width:"440px",margin:'5px'}}
            >
            <Typography variant="headline" component="h1">
                Login
            </Typography>
            <img
                src={AvatarConfig}
                style={{display:'block', margin:"50px auto 0px auto", width:'100px'}}/>
            <br />
            <TextField
                    id="username"
                    label="username"
                    type="text"
                    style={{width: '200px', padding:'5px'}}
                    margin="normal"
                    name="username_text"
                    helperText= {this.state.username_helper_text}
                    error={this.state.username_error }
                    value={this.state.username_text}
                    onChange={this.handleChange}
                  />
            <TextField
                    id="password"
                    label="password"
                    name="password_text"
                    type="password"
                    style={{width: '200px', padding:'5px'}}
                    margin="normal"
                    error= {this.state.password_error}
                    helperText= {this.state.password_helper_text}
                    value={this.state.password_text }
                    onChange={this.handleChange}
                    />
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={this.handleClick}
                onKeyPress={this.handleKeyPress}>
                    Login
            </Button>
            <Divider
                style={{marginTop:"30px", marginBottom:"30px"}}/>
            <Link
                to="/CreateAccount">
                <Button
                    style={{color: "grey", fontSize:"10px", fontStyle: "italic"}}>
                        Create Account
                </Button>
            </Link>
            <Link
                to="/ForgotPassword">
                <Button
                    href="#text-buttons"
                    style={{color: "grey", fontSize:"10px", fontStyle: "italic"}}>
                        Forgot Password
                </Button>
            </Link>
        </Paper>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
        return {
            globalLoginDetails: (username_) => {
                console.log("setting global login dets for: " + username_);
                const action = { type: 'login', username: username_};
                dispatch(action);
            }
        }
     }

function mapStateToProps(state) {
    console.log('mapStateToProps', state)
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(LoginPage));