import React, { Component } from "react"
import { Redirect ,Link } from 'react-router-dom'
import { connect } from "react-redux"
import AnimatePage from "../../components/AnimatePage" 
import CircularProgress from '@material-ui/core/CircularProgress';

import { login } from "../../actions/auth_actions"

class Login extends Component {
    constructor(props) {
        super(props);
        this.switchTheme = this.switchTheme.bind(this);
    }
    state = {
        username : "",
        password : "",
        progress : false,
        isDarkMode: true
    }
    render() {
        const { isAuthenticated } = this.props.authReducer;
        const { progress, isDarkMode } = this.state;

        document.body.classList.toggle("dark-mode", isDarkMode);
        if ( isAuthenticated ){
            return <Redirect to='/'/>
        }
        return (
            <div>
                <div class="login-box">
                <h1>Login</h1>
                <form onSubmit={this.onFormSubmit.bind(this)}>
                <input
                    value = {this.state.username}
                    className="form-control custom-input"
                    name="username"
                    type="text"
                    onChange={this.onInputChange.bind(this)}
                    placeholder = "Username"
                    id="login-input"
                    />
                <input
                    value={this.state.password}
                    className="form-control custom-input"
                    name="password"
                    type="password"
                    onChange={this.onInputChange.bind(this)}
                    placeholder="Password"
                    />
                <button type="submit" id="login-button">Login</button>
                </form>
                </div>

                <div class="theme-toggle">
                    <h2></h2>
                    <label class="switch">
                    <input type="checkbox" onChange={this.switchTheme} />
                    <span class="slider"></span>
                    </label>
                </div>
            </div>
        )
    }

    onInputChange(e){
        this.setState({[e.target.name] : e.target.value})
    }

    onFormSubmit(e){
        e.preventDefault()
        const { progress , ...values} = this.state
        this.setState({ progress: true })

        // send the request to the server
        this.props.login(values , () => {
            this.setState({
                progress: false, username : "" , password : ""
            })
        })
    }

    switchTheme() {
        const body = document.body;
        const loginBox = document.querySelector(".login-box");
        const h1 = document.getElementsByTagName("h1")[0];
        const inputs = document.querySelectorAll("input");
        const loginButton = document.getElementById("login-button");
        const h2 = document.getElementsByTagName("h2")[0];
        this.setState((prevState) => ({ isDarkMode: !prevState.isDarkMode }));

        loginBox.classList.toggle("dark-mode");
        body.classList.toggle("dark-mode");
        h1.classList.toggle("dark-mode");
        inputs.forEach(input => {
            input.classList.toggle("dark-mode");
        });
        loginButton.classList.toggle("dark-mode");
        h2.classList.toggle("dark-mode");
    }
}
      
const mapStateToProps =  ( {authReducer} ) => {
    return { authReducer }
}
export default connect(mapStateToProps, { login })(Login)