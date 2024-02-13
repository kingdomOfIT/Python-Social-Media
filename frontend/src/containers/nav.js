import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { connect } from 'react-redux';
import { logout } from '../actions/auth_actions';
import { profile } from '../actions/auth_actions';
import { listUsers } from '../actions/auth_actions';
import '../../static/frontend/mystyle.css';
import SearchableDropdown from "../components/SearchableDropdown";

const Nav = (props) => {
    const [value, setValue] = useState("");
    const history = useHistory();
    const location = useLocation();
    
    // Extract user information outside the component rendering
    const { user } = props.authReducer;

    const getUserInfo = (userId) => {
        const targetPath = `/user-info?user_id=${userId}`;

        console.log("Current Path:", location.pathname + location.search);
        console.log("Target Path:", targetPath);

        // Check if the target path is different from the current location before pushing
        if (location.pathname + location.search !== targetPath) {
            history.push(targetPath);
            window.location.reload();
        }
    };

    useEffect(() => {
        props.listUsers();
    }, [props.listUsers]);
    

    const renderNavBar = () => {
        const { isAuthenticated } = props.authReducer;
        if (isAuthenticated) {
            const { username } = props.authReducer.user;
            return (
                <div className="navbar">
                    <div className="left-side">
                        <a href="#">
                            <img src={"../../../media/img/SMLogo.png"} alt="Logo" className="logo" />
                        </a>
                        <div className="Appp">
                            <SearchableDropdown
                                options={props.users}
                                label="first_name"
                                id="id"
                                selectedVal={value}
                                handleChange={(val) => setValue(val)}
                            />
                        </div>
                    </div>
                    <p className="welcome-text" style={{ fontSize: '25px', textAlign: 'left', fontFamily: 'cursive', marginRight: '80px', paddingTop: '10px' }}>Hope springs eternal...</p>
                    <div className="right-side">
                        <button onClick={() => getUserInfo(props.authReducer.user.id)} className="button">My Profile</button>
                        <button onClick={props.logout} className="button" to="/">Log Out</button>
                    </div>
                </div>
            );
        } else {
            return (
                <nav className="navbar navbar-expand navbar-light custom-nav fixed-top">
                    <div className="container">
                        <a className="navbar-custom-color" href="#">Writer</a>
                        <div className="collapse navbar-collapse">  
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Log In</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Sign Up</Link>
                            </li>
                        </ul>
                        </div>
                    </div>
                </nav>
            );
        }
    }

    return (
        renderNavBar()
    );
}

const mapStateToProps = ({ authReducer, usersReducer }) => {
    return {
        users: usersReducer.users,
        authReducer: authReducer
    };
}

export default connect(mapStateToProps, { listUsers, logout })(Nav);