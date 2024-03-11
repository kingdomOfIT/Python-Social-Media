import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { getUserLikedPosts } from '../actions/posts_action.js';
import '../../static/frontend/mystyle.css';
import Post from '../components/posts.js';

const LikedPost = ({ location, authReducer, postsReducer, getUserLikedPosts }) => {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('user_id');
    if (userId) {
      getUserLikedPosts(userId, () => {});
    }
  }, [location.search, getUserLikedPosts]);

  const posts = postsReducer.likedPosts;
  const userID = authReducer.user.id;

  if (!posts) {
    return <div>Loading...</div>;
  } else if (posts.length === 0) {
    return (
      <Container style={{ paddingTop: '100px', align:"center"}}>
        <div align="center">
          <h4>Looks like this treasure chest is waiting for you to fill it with your favorite gems! Start liking posts and watch your collection sparkle.</h4>
          <img className="round" src={"../../../media/img/remove.png"} alt="user" />
        </div>
      </Container>
    );
  } else {
    return (
      <Container style={{ paddingTop: '80px', align:"center"}}>
        <div align="left">
          <h2>Whispers of Affinity</h2>
        </div>
        <div className="posts" maxWidth="lg">
          <Post posts={posts} userID={userID} />
        </div>
      </Container>
    );
  }
};

const mapStateToProps = (state) => ({
  authReducer: state.authReducer,
  postsReducer: state.postsReducer || { likedPosts: [] },
});

export default withRouter(connect(mapStateToProps, { getUserLikedPosts })(LikedPost));
