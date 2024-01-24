import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { logout } from '../actions/auth_actions';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import AddModal from '../components/addModal';
import '../../static/frontend/mystyle.css';
import { animals } from "./data/animals";
import SearchableDropdown from "../components/SearchableDropdown";

const Nav = (props) => {
    const [value, setValue] = useState("Search...");
    const [open, setOpen] = useState(false);

    const handleModal = () => {
        setOpen(false);
    }

    const onOpenModal = () => {
        setOpen(true);
    }

    const renderRightLinks = () => {
        const { isAuthenticated } = props.authReducer;
        if (isAuthenticated) {
            const { username } = props.authReducer.user;
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" style={{ margin: "auto 0" }}>
                        <Link className="btn btn-sm btn-outline-info" to="/user-info">
                            {username}<i className="fa fa-user ml-1"></i>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ margin: "auto 0" }}>
                        <button onClick={props.logout} className="btn btn-sm btn-outline-danger ml-2" to="/">
                            Logout
                        </button>
                    </li>
                </ul>
            );
        } else {
            return (
                <h1>Vela havle</h1>
            );
        }
    }

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
                <nav className="navbar navbar-expand navbar-light custom-nav">
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
