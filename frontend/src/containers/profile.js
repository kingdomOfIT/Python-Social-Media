import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { createFollow, deleteFollow, getFollowingUsers } from '../actions/follow_action';
import { getUserPosts } from '../actions/posts_action';
import { getuserByUserID } from '../actions/auth_actions';
import UserProfileMenu from '../components/userProfileMenu';
import Post from '../components/posts';

const UserInfo = ({ location }) => {
  const [ownerIntId, setOwnerIntId] = useState(null);
  const [visitorIntId, setVisitorIntId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFetchingFollowing, setIsFetchingFollowing] = useState(false);

  const authReducer = useSelector(state => state.authReducer);
  const userReducer = useSelector(state => state.userReducer);
  const userPostsReducer = useSelector(state => state.userPostsReducer || { posts: [] });
  const following = useSelector(state => state.following_posts_reducer.following);

  const dispatch = useDispatch();

  const fetchUserData = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('user_id');

    if (userId) {
      try {
        await dispatch(getuserByUserID(userId));
        await dispatch(getUserPosts(userId));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    const ownerIntId = parseInt(userId, 10);
    const visitorIntId = parseInt(authReducer.user.id, 10);

    // Check if following data is already being fetched
    if (!isFetchingFollowing) {
      setIsFetchingFollowing(true); // Set flag to true to prevent duplicate fetches
      await dispatch(getFollowingUsers(visitorIntId));
    }

    setOwnerIntId(ownerIntId);
    setVisitorIntId(visitorIntId);
    console.log("******OID: ", ownerIntId)
    console.log("******VID: ", visitorIntId)
    console.log("=====Following: ", following)
    setIsFollowing(following.some(user => user.id === ownerIntId));
  }, [dispatch, location.search, authReducer.user.id, following, isFetchingFollowing]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleOpenMenu = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleFollow = () => {
    if (isFollowing) {
      dispatch(deleteFollow(authReducer.user.id, ownerIntId));
      setIsFollowing(false);
    } else {
      dispatch(createFollow({ targetUser: ownerIntId }));
      setIsFollowing(true);
    }
  };

  if (_.isEmpty(userReducer.userByUserId)) {
    console.log('User2 is empty. Rendering loading state...');
    return <Container style={{ paddingTop: '150px', align: 'center' }}></Container>;
  }
  
  const targetUser = userReducer.userByUserId;
  const imagePath = targetUser.profile ? targetUser.profile.image_url : 'https://picsum.photos/200';
  const followersCount = targetUser.profile ? targetUser.profile.followersCount : 0;
  const followingCount = targetUser.profile ? targetUser.profile.followingCount : 0;
  const posts = userPostsReducer || [];
  posts.forEach(post => {
    post.createdAt = new Date(post.createdAt);
  });
  posts.sort((a, b) => b.createdAt - a.createdAt);
  const userID = authReducer.user.id;

  return (
    <Container style={{ paddingTop: '150px', align: 'center' }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Avatar className="avatar" alt="User Profile Picture" src={imagePath} style={{ width: '150px', height: '150px', marginBottom: '10px' }} />

          <Typography variant="h5" component="div" align="center" gutterBottom>
            {targetUser.first_name} {targetUser.last_name}
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
                  <strong>{posts.length}</strong>
                </Typography>
              </div>
              <Typography variant="caption">Posts</Typography>
            </div>
          </div>

          {ownerIntId === visitorIntId && (
            <Button onClick={handleOpenMenu} className="follow-button" variant="contained" color="primary" fullWidth>
              Edit Your Profile
            </Button>
          )}
          {ownerIntId !== visitorIntId && (
            <Button className="follow-button" variant="contained" color="primary" fullWidth onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}

          {isDialogOpen && <UserProfileMenu open={isDialogOpen} onClose={handleCloseDialog} />}
        </Grid>
      </Grid>
      <div className="posts">
        {posts.length === 0 ? (
          <div align="center" style={{ color: '#5292f6' }}>
            <p>This profile is ready and waiting to share its first post!</p>
          </div>
        ) : (
          <Post posts={posts} userID={userID} />
        )}
      </div>
    </Container>
  );
};

export default withRouter(UserInfo);
