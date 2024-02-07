import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import "react-image-crop/dist/ReactCrop.css";
import { withRouter } from 'react-router-dom';

import Container from '@material-ui/core/Container';

import { fetchFollowingPosts } from '../actions/follow_action.js'
import '../../static/frontend/mystyle.css';
import Post from "../components/posts.js";



export class FollowingPosts extends Component {
    constructor(props) {
        super(props)
        this.modulRef = React.createRef();
        this.state = {
            progress: false,
            open: false
        }
    }
    componentDidMount() {
        const { location } = this.props;
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id');
        
        if (userId) {
            this.props.fetchFollowingPosts(userId);
        }
    }

    render() {
        const posts = this.props.following_posts_reducer.follows;
        const userID = this.props.authReducer.user.id;
        console.log("->>>>>>: ", posts)

        return (
            <Container style={{ paddingTop: '80px', align:"center"}}>
                <div align="center">
                    <h1>Following Posts</h1>
                </div>
                <div className="posts">
                    <Post
                        posts={posts}
                        userID={userID}
                    />
                </div>
                </Container>
          );
        };
}

const mapStateToProps = (state) => ({
    authReducer: state.authReducer,
    following_posts_reducer: state.following_posts_reducer || { posts: [] },
});
  
  export default withRouter(connect(mapStateToProps, { fetchFollowingPosts })(FollowingPosts));
