import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import _ from 'lodash';

import 'react-image-crop/dist/ReactCrop.css';

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { listUsers } from '../actions/auth_actions';
import { fetchFollowingPosts } from '../actions/follow_action.js';
import { loadPage } from '../actions/posts_action.js';

import '../../static/frontend/mystyle.css';

import AnimatePage from '../components/AnimatePage.js';
import Post from '../components/posts.js';
import RightSidebar from '../components/rightSidebar.js';
import Sidebar from '../components/sidebar.js';

const useStyles = theme => ({
    load: {
        margin: "10px auto",
        width: "max-content"
    }
});

const FollowingPosts = ({ classes, location, fetchFollowingPosts, listUsers, loadPage, authReducer, followingPosts, users }) => {
    const [progress, setProgress] = useState(false);

    const modulRef = useRef();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id');

        if (userId) {
            fetchFollowingPosts(userId);
        }
        listUsers(() => {});
    }, [location.search, fetchFollowingPosts, listUsers]);

    const loadPageClicked = () => {
        setProgress(true);
        loadPage(() => {
            setProgress(false);
        });
    };

    const { nextPage } = followingPosts.follows;
    const posts = followingPosts.follows;
    const userID = authReducer.user.id;
    const sortedUsers = users
        .filter(user => user.profile !== null)
        .sort((a, b) => b.profile.followersCount - a.profile.followersCount)
        .slice(0, 6);

    return (
        <div className="flex-container">
            <div className="box1">
                <Sidebar />
            </div>
            <div className="box2">
                <div className={classes.pc}>
                    <AnimatePage />
                    <Container>
                        {posts.length === 0 ? (
                            <div align="center" style={{color:"#5292f6"}}>
                                <p>Looks like you're not following anyone yet! Start exploring and connecting with interesting profiles to fill up your feed.</p>
                            </div>
                        ) : (
                            <Post posts={posts} userID={userID} />
                        )}
                        <div className={classes.load}>
                            { nextPage &&
                            <Button variant="outlined" size="medium" color="primary"
                            onClick={loadPageClicked} style = {{ marginRight : "5px"}}>
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
    );
};

const mapStateToProps = (state) => ({
    authReducer: state.authReducer,
    followingPosts: state.following_posts_reducer || { posts: [] },
    users: state.usersReducer.users
});
  
export default connect(mapStateToProps, { fetchFollowingPosts, loadPage, listUsers })(withStyles(useStyles)(withRouter(FollowingPosts)));
