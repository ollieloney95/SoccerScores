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


class CreateAccount extends Component {

  constructor(props) {
      super(props);
      this.state = {
          username_text: "",
          password_text: "",
          password_text2: "",
          name_text: "",
          email_text: "",

          username_error: "",
          password_error: "",
          password_error2: "",
          name_error: "",
          email_error: "",

          username_error_text: "",
          password_error_text: "",
          password_error2_text: "",
          name_error_text: "",
          email_error_text: ""
      }
      this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
       this.setState({[event.target.name]: event.target.value});
       this.validateInput(event.target.name, event.target.value)
     }

  validateInput(item,val){
    //checking username text ----------------------------------
    if(item === "username_text"){
        console.log("in username_text")
        this.setState({username_error:false, username_error_text:''})
        //this.state.username_error = false
        //this.state.username_error_text = ""
        if(val.length < 4){
            this.setState({username_error:true, username_error_text:"too short"})
            //this.state.username_error = true
            //this.state.username_error_text = "too short"
        }else if(val.length > 14){
            this.setState({username_error:true, username_error_text:'too long'})
            //this.state.username_error = true
            //this.state.username_error_text = "too long"
        }else if(false === /^[a-z]+$/i.test(val)){
            this.setState({username_error:true, username_error_text:'invalid characters'})
            //this.state.username_error = true
            //this.state.username_error_text = "invalid characters"
        }
    }

    //checking password text ----------------------------------
    if(item === "password_text"){
        this.setState({password_error:false, password_error_text:''})
        //this.state.password_error = false
        //this.state.password_error_text = ""
        if(val.length < 4){
            this.setState({password_error:true, password_error_text:'too short'})
            //this.state.password_error = true
            //this.state.password_error_text = "too short"
        }else if(val.length > 14){
            this.setState({password_error:true, password_error_text:'too long'})
            //this.state.password_error = true
            //this.state.password_error_text = "too long"
        }else if(false === /^[a-z]+$/i.test(val)){
            this.setState({password_error:true, password_error_text:'invalid characters'})
            //this.state.password_error = true
            //this.state.password_error_text = "invalid characters"
        }
    }

    //checking password2 text ----------------------------------
    if(item === "password_text2"){
        this.setState({password_error2:false, password_error2_text:''})
        //this.state.password_error2 = false
        //this.state.password_error2_text = ""
        if(this.state.password_text !== val){
            this.setState({password_error2:true, password_error2_text:'passwords do not match'})
            //this.state.password_error2 = true
            //this.state.password_error2_text = "passwords do not match"
        }
    }

    //checking name text ----------------------------------
    if(item === "name_text"){
        this.setState({name_error:false, name_error_text:''})
        //this.state.name_error = false
        //this.state.name_error_text = ""
        if(val.length > 14){
            this.setState({name_error:true, name_error_text:'too long'})
            //this.state.name_error = true
            //this.state.name_error_text = "too long"
        }else if(false === /^[a-z]+$/i.test(val)){
            this.setState({name_error:true, name_error_text:'invalid characters'})
            //this.state.name_error = true
            //this.state.name_error_text = "invalid characters"
        }
    }

    //checking enail text ----------------------------------
    if(item === "email_text"){
        this.setState({email_error:false,email_error_text:''})
        if(val.includes("@") === false){
            this.setState({email_error:true, email_error_text:'invalid email'})
        }
    }
  }

  handleClick = (event) => {
      console.log('handleClick', event)
      console.log(this.state.username_text)
      console.log(this.state.password_text)
      console.log(this.state.name_text)
      console.log(this.state.email_text)
      fetch(process.env.REACT_APP_BACKEND_HOST + ':' + process.env.REACT_APP_BACKEND_PORT  + "/addAccount/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username_text,
          password: this.state.password_text,
          name: this.state.name_text,
          email: this.state.email_text
        })
      })
      .then((response) => response.text())
      .then((responseText) => {
        console.log('responseText', responseText, typeof responseText, responseText === 0, responseText === '0');
        var added_user = parseInt(responseText);
        if (added_user === 0){
          this.props.enqueueSnackbar("added user: " + this.state.username_text, {variant:'success'})
          this.props.history.push('/LoginPage')
        }else if(added_user === 1){
          this.props.onPopUp("failed to add user: username already exists");
          this.props.enqueueSnackbar("failed to add user: username already exists", {variant:'error'})
        }else if(added_user === 2){
          this.props.onPopUp("failed to add user: invalid password");
          this.props.enqueueSnackbar("failed to add user: invalid password", {variant:'error'})
        }
      })
      .catch((error) => {
          console.error(error);
          this.props.enqueueSnackbar("failed request" + String(error), {variant:'error'})
      });
    }

  render() {
    return (
      <div
        style={{
            display:'block',
            margin:'20px auto',
            width:"450px",
            overflow:'hidden',
            marginTop:'70px',
        }}>
        <Paper
            elevation={1}
            style={{width:"440px", margin:'5px'}}
            >
            <Typography variant="headline" component="h1">
                Create Account
            </Typography>
            <img
                src={AvatarConfig}
                style={{display:'block', margin:"50px auto 0px auto", width:'100px'}}/>
            <TextField
                    id="username"
                    label="username"
                    type="text"
                    style={{width: '200px', padding:'5px'}}
                    margin="normal"
                    name="username_text"
                    error={this.state.username_error}
                    helperText={this.state.username_error_text}
                    value={this.state.username_text}
                    onChange={this.handleChange}
                  />
            <TextField
                    id="password"
                    label="password"
                    name="password_text"
                    type="password"
                    style={{width: '200px', padding:'5px'}}
                    error={this.state.password_error}
                    helperText={this.state.password_error_text}
                    margin="normal"
                    value={this.state.password_text }
                    onChange={this.handleChange}
                    />
            <br />
            <TextField
                    id="name"
                    label="name"
                    name="name_text"
                    type="text"
                    style={{width: '200px', padding:'5px'}}
                    margin="normal"
                    error={this.state.name_error}
                    helperText={this.state.name_error_text}
                    value={this.state.name_text }
                    onChange={this.handleChange}
                    />
            <TextField
                    id="password2"
                    label="check password"
                    name="password_text2"
                    type="password"
                    style={{width: '200px', padding:'5px'}}
                    margin="normal"
                    error={this.state.password_error2}
                    helperText={this.state.password_error2_text}
                    value={this.state.password_text2 }
                    onChange={this.handleChange}
                    />
            <br />
            <TextField
                    id="email"
                    label="email"
                    name="email_text"
                    type="text"
                    style={{width: '200px', padding:'5px'}}
                    margin="normal"
                    error={this.state.email_error}
                    helperText={this.state.email_error_text}
                    value={this.state.email_text }
                    onChange={this.handleChange}
                    />
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={this.handleClick}
                disabled={this.state.email_error || this.state.name_error || this.state.password_error || this.state.password_error2 || this.state.name_error ||
                          this.state.username_text === "" || this.state.password_text === "" | this.state.password_text2 === "" || this.state.name_text === "" || this.state.email_text === ""}>

                    Create

            </Button>
            <Divider
                style={{marginTop:"30px", marginBottom:"30px",}}
                />
            <Link to="/LoginPage">
                <Button
                    href="#text-buttons"
                    style={{color: "grey", fontSize:"10px", fontStyle: "italic"}}>
                        Login
                </Button>
            </Link>
            <Link to="/ForgotPassword">
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
            onPopUp: (msg) => {
                console.log("popping up");
                const action = { type: 'open_popup', message: msg};
                dispatch(action);
            },
            closePopUp: () => {
                console.log("popping down");
                const action = { type: 'close_popup' };
                dispatch(action);
            }
        }
     }

function mapStateToProps(state) {
    console.log('mapStateToProps', state)
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(CreateAccount));