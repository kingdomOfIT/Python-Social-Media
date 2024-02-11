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
    else {
      if (posts.length === 0) {
            return (
                <Container style={{ paddingTop: '100px', align:"center"}}>
                    <div align="center">
                        <h4>Looks like this treasure chest is waiting for you to fill it with your favorite gems! Start saving posts and watch your collection sparkle.</h4>
                        {/* <img className="round" src={"../../static/frontend/papersE.png"} alt="user" /> */}

                    </div>
                </Container>
            );
        }
        else {
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
        };

    }
  }
}

const mapStateToProps = (state) => ({
  authReducer: state.authReducer,
  postsReducer: state.postsReducer || { likedPosts: [] },
});

export default withRouter(connect(mapStateToProps, { getUserLikedPosts })(LikedPost));
