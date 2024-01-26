import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { logout } from '../actions/auth_actions';
import '../../static/frontend/mystyle.css';
import { animals } from "./data/animals";
import SearchableDropdown from "../components/SearchableDropdown";

const Nav = (props) => {
    const [value, setValue] = useState("Search...");

    const renderNavBar = () => {
        const { isAuthenticated } = props.authReducer;
        if (isAuthenticated) {
            const { username } = props.authReducer.user;
            return (
                <div className="navbar">
                    <div className="left-side">
                        <img src={"../../static/frontend/profile-placeholder.svg"} alt="Logo" className="logo" />
                        <div className="Appp">
                            <SearchableDropdown
                                options={animals}
                                label="name"
                                id="id"
                                selectedVal={value}
                                handleChange={(val) => setValue(val)}
                            />
                        </div>
                    </div>
                    <div className="right-side">
                        <button to="/user-info" className="button">My Profile</button>
                        <button onClick={props.logout} className="button" to="/">Logout</button>
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
                                <Link className="nav-link" to="/login">Login</Link>
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

const mapStateToProps = ({ authReducer }) => {
    return { authReducer };
}

export default connect(mapStateToProps, { logout })(Nav);
