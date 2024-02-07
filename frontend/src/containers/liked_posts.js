import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import 'react-image-crop/dist/ReactCrop.css';
import { withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { getUserLikedPosts } from '../actions/posts_action';
import '../../static/frontend/mystyle.css';
import Post from '../components/posts.js';

export class LikedPost extends Component {

  componentDidMount() {
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    const userId = params.get('user_id');

    if (userId) {
      this.props.getUserLikedPosts(userId, () => {});
    }
  }

  render() {
    const posts = this.props.postsReducer.likedPosts;
    const userID = this.props.authReducer.user.id;

    if (!posts) {
      return <div>Loading...</div>;
    }

    return (
      <Container style={{ paddingTop: '80px', align: 'center' }}>
        <div align="center">
          <h1>Liked Posts</h1>
        </div>
        <div className="posts" maxWidth="lg">
          <Post posts={posts} userID={userID} />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  authReducer: state.authReducer,
  postsReducer: state.postsReducer || { likedPosts: [] },
});

export default withRouter(connect(mapStateToProps, { getUserLikedPosts })(LikedPost));
