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
import { getUserPosts } from '../actions/posts_action'
import { getuserByUserID } from '../actions/auth_actions.js'
import '../../static/frontend/mystyle.css';
import UserProfileMenu from '../components/userProfileMenu.js'

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

    async componentDidMount() {
        const { location, authReducer } = this.props;
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
        this.setState({ ownerIntId, visitorIntId });
    }

    render() {
        let { userReducer } = this.props;

        const { ownerIntId,  visitorIntId} = this.state;

        if (_.isEmpty(userReducer.userByUserId)) {
            console.log('User2 is empty. Rendering loading state...');
            return (
                <Container style={{ paddingTop: '150px', align: "center" }}>
                </Container>
            );
        }

        const user2 = userReducer.userByUserId
        const imagePath = user2.profile ? user2.profile.image_path : "https://picsum.photos/200";
        const followers_count = user2.profile ? user2.profile.followers_count : 5;
        const following_count = user2.profile ? user2.profile.following_count : 5;
        const posts = this.props.userPostsReducer;
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
                                <strong>{followers_count}</strong>
                                </Typography>
                            </div>
                            <Typography variant="caption">Followers</Typography>
                            </div>

                            <div align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1">
                                <strong>{following_count}</strong>
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
                    <Button className="follow-button" variant="contained" color="primary" fullWidth>
                        Follow
                    </Button>
                    )}


                    {this.state.isDialogOpen && <UserProfileMenu open={this.state.isDialogOpen} onClose={this.handleCloseDialog} />}
                    </Grid>
                </Grid>
                <div className="posts">
                    <Post posts={posts} userID={userID} />
                </div>
                </Container>
          );
        };
}

const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer,
        userPostsReducer: state.userPostsReducer || { posts: [] },
        userReducer: state.userReducer
    };
};

export default withRouter(connect(mapStateToProps, { updateUserInfo, updateUserImage, getUserPosts, getuserByUserID })(UserInfo));
