import React, { useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import { connect } from "react-redux";
import AnimatePage from "../../components/AnimatePage";
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { login } from "../../actions/auth_actions";

function provider_login_url(provider) {
    return provider === 'google' ? '/account/google/login' : '/';
}

const Login = ({ authReducer, login }) => {
    const [state, setState] = useState({
        username: "",
        password: "",
        progress: false,
        anchorEl: null
    });

    const handleClick = (event) => {
        setState({ ...state, anchorEl: event.currentTarget });
    };

    const handleClose = () => {
        setState({ ...state, anchorEl: null });
    };

    const { isAuthenticated } = authReducer;
    const { progress, anchorEl } = state;
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const image_url = "/media/img/SMLogo.png";

    const onInputChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        setState({ ...state, progress: true });

        // send the request to the server
        login({ ...state, progress }, () => {
            setState({ ...state, progress: false, username: "", password: "" });
        });
    };

    if (isAuthenticated) {
        return <Redirect to='/' />;
    }

    return (
        <div className="login-page">
            <AnimatePage />
            <div className="login-page-content">
                <div className="login-page-content-inner">
                    <div className="form-box animated bounceIn">
                        <form onSubmit={onFormSubmit}>
                            <img src={image_url} className="center-login-image" alt="Logo" />
                            <div className="form-group">
                                <input
                                    value={state.username}
                                    className="form-control custom-input"
                                    name="username"
                                    type="text"
                                    onChange={onInputChange}
                                    placeholder="Username"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    value={state.password}
                                    className="form-control custom-input"
                                    name="password"
                                    type="password"
                                    onChange={onInputChange}
                                    placeholder="Password"
                                />
                            </div>
                            <button style={{ marginRight: "5px" }} className="btn btn-general btn-login"> Log In </button>
                            <CircularProgress style={progress ? { display: "inline-block" } : { display: "none" }} />
                        </form>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
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
    );
};

const mapStateToProps = ({ authReducer }) => {
    return { authReducer };
};

export default connect(mapStateToProps, { login })(Login);
