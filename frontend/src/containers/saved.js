import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { getUserSavedPosts } from '../actions/posts_action.js';
import '../../static/frontend/mystyle.css';
import Post from '../components/posts.js';

const SavedPost = ({ location, userSavedPosts, authUser, getUserSavedPosts }) => {
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id');
        if (userId) {
            getUserSavedPosts(userId);
        }
    }, [location.search, getUserSavedPosts]);

    const { savedPosts } = userSavedPosts;
    const userID = authUser.id;

    return (
        <Container style={{ paddingTop: '80px', align:"center"}}>
            {savedPosts.length === 0 ? (
                <div align="center">
                    <h4>Looks like this treasure chest is waiting for you to fill it with your favorite gems! Start saving posts and watch your collection sparkle.</h4>
                    <img className="round" src={"../../../media/img/remove.png"} alt="user" />
                </div>
            ) : (
                <div>
                    <div align="left">
                        <h2>Whispers of Affinity</h2>
                    </div>
                    <div className="posts" maxWidth="lg">
                        <Post posts={savedPosts} userID={userID} />
                    </div>
                </div>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => ({
    authUser: state.authReducer.user,
    userSavedPosts: state.user_saved_posts_reducer || { savedPosts: [] },
});

export default withRouter(connect(mapStateToProps, { getUserSavedPosts })(SavedPost));
