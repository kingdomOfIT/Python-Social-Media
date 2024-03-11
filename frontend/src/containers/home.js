import React, { useState, useEffect, useCallback } from 'react';
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

const useStyles = theme => ({
    load: {
        margin: "10px auto",
        width: "max-content"
    }
});

const Home = ({ classes, authReducer, users, loadPage, listUsers, posts }) => {
    const [progress, setProgress] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        listUsers(() => {});
    }, [listUsers]);

    const handleModal = useCallback(() => {
        setOpen(false);
    }, []);

    const onOpenModal = useCallback(() => {
        setOpen(true);
    }, []);

    const loadPageClicked = useCallback(() => {
        setProgress(true);
        loadPage(() => {
            setProgress(false);
        });
    }, [loadPage]);

    const userProfileImage = authReducer.user.profile ? authReducer.user.profile.image_url : "https://picsum.photos/200";

    const sortedUsers = users
        .filter(user => user.profile !== null)
        .sort((a, b) => b.profile.followersCount - a.profile.followersCount)
        .slice(0, 6);

    const userID = authReducer.user.id;
    const postsData = posts.posts ? posts.posts : posts;
    const loadPosts = posts.loadPosts;

    if (loadPosts) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}><CircularProgress /></div>;
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
                            <img src={userProfileImage} alt="Profile Picture" />
                        </div>
                        <input type="text" className="text-field" placeholder="Your amazing story starts here..." onClick={onOpenModal} />
                        <AddModal open={open} onClose={handleModal} />
                    </div>
                </div>
                <div className={classes.pc}>
                    <AnimatePage />
                    <Container>
                        <Post
                            posts={postsData}
                            userID={userID}
                        />
                        <div className={classes.load}>
                            {posts.nextPage && (
                                <Button variant="outlined" size="medium" color="primary" onClick={loadPageClicked} style={{ marginRight: "5px" }}>
                                    Load More
                                </Button>
                            )}
                            {progress && <CircularProgress />}
                        </div>
                    </Container>
                </div>
            </div>
            <div className="box3">
                <div className="container-card">
                    <h2>Top Writers</h2>
                    <RightSidebar
                        sortedUsers={sortedUsers}
                    />
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
        users: state.usersReducer.users,
        posts: state.postsReducer
    };
};

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    authReducer: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    loadPage: PropTypes.func.isRequired,
    listUsers: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { loadPage, listUsers })(withStyles(useStyles)(withRouter(Home)));
