import React, { Component } from "react"
import { Redirect ,Link } from 'react-router-dom'
import { connect } from "react-redux"
import AnimatePage from "../../components/AnimatePage" 
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { login } from "../../actions/auth_actions"

function provider_login_url(provider) {
    if (provider === 'google') {
        return '/account/google/login';
    } else {
        return '/';
    }
}

class Login extends Component {
    state = {
        username : "",
        password : "",
        progress : false,
        anchorEl: null
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { isAuthenticated } = this.props.authReducer
        const  { progress, anchorEl } = this.state
        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;

        const image_url = "/media/img/SMLogo.png"
        if ( isAuthenticated ){
            return <Redirect to='/'/>
        }
        return (
            <div className="login-page">
                <AnimatePage />
                <div className="login-page-content">
                    <div className="login-page-content-inner">
                        <div className="form-box animated bounceIn">
                        <form onSubmit={this.onFormSubmit.bind(this)} >
                            <img src={image_url} className="center-login-image" />
                            <div className="form-group">
                                <input
                                value = {this.state.username}
                                className="form-control custom-input"
                                name="username"
                                type="text"
                                onChange={this.onInputChange.bind(this)}
                                placeholder = "Username"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                value={this.state.password}
                                className="form-control custom-input"
                                name="password"
                                type="password"
                                onChange={this.onInputChange.bind(this)}
                                placeholder="Password"
                                />
                            </div>
                            <button style={{ marginRight : "5px"}} className="btn btn-general btn-login"> Log In </button>
                            <CircularProgress style={progress ? { display: "inline-block" } : { display: "none" }} />
                            {/* <a className="text-helper">
                                New to Writer? <a className="nav-item" href={provider_login_url('google')}> Google</a>
                            </a> */}
                        </form>
                        {/* <button style={{ marginRight : "5px", marginTop:"10px"}} className="btn btn-general btn-login" aria-describedby={id} variant="contained" onClick={this.handleClick}>
                        Continue with Google
                        </button> */}
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={this.handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                        >
                            <Typography sx={{ p: 2 }}>As soon as Google validates the app, it will be available. 💛</Typography>
                        </Popover>
                        <p className="text-helper">
                            New to Writer? <Link className="nav-item" to="/register"> Sign Up</Link>
                        </p>
                        </div>
                    </div>
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
}
      
const mapStateToProps =  ( {authReducer} ) => {
    return { authReducer }
}
export default connect(mapStateToProps, { login })(Login)
