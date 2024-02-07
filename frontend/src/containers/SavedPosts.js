import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import "react-image-crop/dist/ReactCrop.css";
import { withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import { getUserSavedPosts } from '../actions/posts_action'
import '../../static/frontend/mystyle.css';

import Post from '../components/posts.js';


export class SavedPost extends Component {
    componentDidMount() {
        const { location } = this.props;
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id');
        
        if (userId) {
            this.props.getUserSavedPosts(userId, () => {});
        }
    }

    render() {

        const posts = this.props.user_saved_posts_reducer.savedPosts;
        const userID = this.props.authReducer.user.id;

        return (
            <Container style={{ paddingTop: '80px', align:"center"}}>
                <div align="center">
                    <h1>Saved Posts</h1>
                </div>
                <div className="posts" maxWidth="lg">
                    <Post posts={posts} userID={userID} />
                </div>
                </Container>
          );
        };
}

const mapStateToProps = (state) => ({
    authReducer: state.authReducer,
    user_saved_posts_reducer: state.user_saved_posts_reducer || { savedPosts: [] },
  });
  
  export default withRouter(connect(mapStateToProps, { getUserSavedPosts })(SavedPost));
