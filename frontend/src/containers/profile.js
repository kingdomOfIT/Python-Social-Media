import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from "lodash"
import "react-image-crop/dist/ReactCrop.css";
import { withRouter } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { updateUserInfo } from "../actions/index"
import { updateUserImage } from '../actions/index'
import { getUserPosts } from '../actions/posts_action.js'
import { getuserByUserID } from '../actions/auth_actions.js'
import UserProfileMenu from '../components/userProfileMenu.js'
import PropTypes from 'prop-types';
import { createFollow, deleteFollow, getFollowingUsers } from '../actions/follow_action.js'; 

import Post from '../components/posts.js';


export class UserInfo extends Component {
    constructor(props) {
        super(props)
        this.state = { ownerIntId: null };
    }

    handleOpenMenu = () => {
        this.handleOpenDialog();
    };
    
    handleOpenDialog = () => {
        this.setState({ isDialogOpen: true });
    };
    
    handleCloseDialog = () => {
        this.setState({ isDialogOpen: false });
    };

    isFollowing = (targetUserId, followingArray) => {
        if (followingArray) {
            for (let i = 0; i < followingArray.length; i++) {
                if (followingArray[i].id === targetUserId) {
                    return true;
                }
            }
        }
        return false;
    };
    handleFollow = (ownerIntId, userId, followingArray) => {
        if (this.isFollowing(ownerIntId, followingArray)) {
          this.props.deleteFollow(userId, ownerIntId, () => {});
          window.location.reload()
        } else {
          this.props.createFollow({ targetUser: ownerIntId }, () => {});
          window.location.reload()
        }
      };

    async componentDidMount() {
        const { location, authReducer, following_posts_reducer } = this.props;
        const params = new URLSearchParams(location.search);
        const userId = params.get("user_id");
    
        if (userId) {
            try {
                this.props.getuserByUserID(userId, () => {});
                this.props.getUserPosts(userId, () => {});
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    
        const ownerIntId = parseInt(userId, 10);
        const visitorIntId = parseInt(authReducer.user.id, 10);
        this.props.getFollowingUsers(visitorIntId, () => {});
        const followingList = following_posts_reducer.following;
        this.setState({ ownerIntId, visitorIntId, followingList });
    }

    render() {
        let { userReducer } = this.props;

        const { ownerIntId,  visitorIntId, followingList} = this.state;

        if (_.isEmpty(userReducer.userByUserId)) {
            console.log('User2 is empty. Rendering loading state...');
            return (
                <Container style={{ paddingTop: '150px', align: "center" }}>
                </Container>
            );
        }

        const user2 = userReducer.userByUserId
        console.log("This is: ", user2)
        const imagePath = user2.profile ? user2.profile.image_url : "https://picsum.photos/200";
        const followersCount = user2.profile ? user2.profile.followersCount : 5;
        const followingCount = user2.profile ? user2.profile.followingCount : 5;
        const posts = this.props.userPostsReducer;
        const followingArray = this.props.following_posts_reducer.following;
        posts.forEach(post => {
            post.createdAt = new Date(post.createdAt);
          });
        posts.sort((a, b) => b.createdAt - a.createdAt);
        const userID = this.props.authReducer.user.id;


        return (
            <Container style={{ paddingTop: '150px', align:"center"}}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6} lg={4}>
                    <Avatar className="avatar" alt="User Profile Picture" src={imagePath} style={{ width: '150px', height: '150px', marginBottom: '10px'}}/>

                    <Typography variant="h5" component="div" align="center" gutterBottom>
                        {user2.first_name} {user2.last_name}
                    </Typography>

                    <div align="center" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                        <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>{followersCount}</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Followers</Typography>
                            </div>

                            <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>{followingCount}</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Following</Typography>
                            </div>

                            <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>{this.props.userPostsReducer.length}</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Posts</Typography>
                        </div>
                    </div>

                    {ownerIntId === visitorIntId && (
                    <Button onClick={this.handleOpenMenu} className="follow-button" variant="contained" color="primary" fullWidth>
                        Edit Your Profile
                    </Button>
                    )}
                    {ownerIntId !== visitorIntId && (
                    <Button className="follow-button" variant="contained" color="primary" fullWidth 
                    onClick={() => this.handleFollow(ownerIntId, visitorIntId, followingArray)}>
                        {this.isFollowing(ownerIntId, followingArray) ? "Unfollow" : "Follow"}
                    </Button>
                    )}


                    {this.state.isDialogOpen && <UserProfileMenu open={this.state.isDialogOpen} onClose={this.handleCloseDialog} />}
                    </Grid>
                </Grid>
                <div className="posts">
                    {posts.length === 0 ? (
                        <div align="center" style={{color:"#5292f6"}}>
                            <p>This profile is ready and waiting to share its first post!</p>
                            {/* <img className="round" src={"../../static/frontend/papersE.png"} alt="user" /> */}

                        </div>
                    ) : (
                        <Post posts={posts} userID={userID} />
                    )}
                </div>
                </Container>
          );
        };
}

UserInfo.propTypes = {
    followingList: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
        userPostsReducer: state.userPostsReducer || { posts: [] },
        userReducer: state.userReducer,
        following_posts_reducer: state.following_posts_reducer
    };
};

export default withRouter(connect(mapStateToProps, {createFollow, deleteFollow, updateUserInfo, updateUserImage, getUserPosts, getuserByUserID, getFollowingUsers })(UserInfo));
