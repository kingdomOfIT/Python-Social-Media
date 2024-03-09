import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/styles';
import { Container, Button, CircularProgress } from "@material-ui/core";

import Sidebar from "../components/sidebar.js";
import AddModal from '../components/addModal';
import AnimatePage from "../components/AnimatePage";
import Post from '../components/posts.js';
import RightSidebar from '../components/rightSidebar.js';

import { loadPage } from "../actions/posts_action";
import { listUsers } from '../actions/auth_actions';

import '../../static/frontend/mystyle.css';


const useStyles = theme  =>  ({
    load : {
        margin : "10px auto",
        width : "max-content"
    }
});

class Home extends Component {

    state = {
        progress : false,
        open : false
    }

    handleModal = () => {
        this.setState({open : false })
    }
    onOpenModal = () => {
        this.setState({open : true})
    }

    async componentDidMount() {
        this.props.listUsers(() => {});
    }

    render() {
        const { classes, loadPosts} = this.props
        const { nextPage } = this.props.posts
        const { progress} = this.state
        const posts = this.props.posts.posts ? this.props.posts.posts : this.props.posts;
        const userID = this.props.authReducer.user.id;
        const userProfileImage = this.props.authReducer.user.profile ? this.props.authReducer.user.profile.image_url : "https://picsum.photos/200";
        const sortedUsers = this.props.users
        .filter(user => user.profile !== null)
        .sort((a, b) => b.profile.followersCount - a.profile.followersCount)
        .slice(0, 6);
        
        if (loadPosts){
            return <div style={{ textAlign: "center", marginTop: "50px" }} > <CircularProgress /></div>
        }
        return (
            <div className="flex-container">
                <div className="box1">
                    <Sidebar />
                </div>
                <div className="box2">
                    <div className="create-post">
                    <div className="profile-container">
                        <div className="profile-picture">
                            <img src={userProfileImage}
                            alt="Profile Picture"></img>
                        </div>
                        <input type="text" className="text-field" placeholder="Your amazing story starts here..." onClick={this.onOpenModal}></input>
                        <AddModal open={this.state.open} onClose={this.handleModal} />
                    </div>
                    </div>
                <div className={classes.pc}>
                    <AnimatePage />
                    <Container>
                        <Post
                            posts={posts}
                            userID={userID}
                        />
                        <div className={classes.load}>
                            { nextPage &&
                            <Button variant="outlined" size="medium" color="primary"
                            onClick={this.loadPageClicked} style = {{ marginRight : "5px"}}>
                                Load More
                            </Button> }
                            { progress && <CircularProgress /> }
                        </div>
                    </Container>
                </div>
                </div>
                <div className="box3">
                    <div className = "container-card">
                    <h2>Top Writers</h2>
                        <RightSidebar
                            sortedUsers={sortedUsers}
                        />
                    </div>                                      
                </div>

            </div>
        )
    }

    loadPageClicked = () => {
        const { loadPage } = this.props

        this.setState({ progress: true })
        loadPage( () => {
            this.setState({progress : false})
        })
    }
    
}

const mapStateToProps = (state) => {
    return { 
        authReducer : state.authReducer,
        users: state.usersReducer.users
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { loadPage, listUsers })(withStyles(useStyles)(withRouter(Home)));