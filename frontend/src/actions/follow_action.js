import axios from 'axios';
import { setConfig } from './auth_actions';
import {
    GET_FOLLOWING_POSTS,
    CREATE_FOLLOW,
    DELETE_FOLLOW,
    CREATE_FOLLOW_FAILED,
    GET_FOLLOWING_POSTS_FAILED,
    GET_FOLLOWING_USERS,
    GET_FOLLOWING_USERS_FAILED,
    DELETE_FOLLOW_FAILED,
    DELETE_FOLLOW_SUCCESS
} from './types';

export const fetchFollowingPosts = (userId) => {
    return async (dispatch, getState) => {
        const config = setConfig(getState);
        try {
            const res = await axios.get(`user/${userId}/following_posts/`, config);
            dispatch({
                type: GET_FOLLOWING_POSTS,
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: GET_FOLLOWING_POSTS_FAILED,
                payload: error.response ? error.response.data : 'Unexpected error occurred'
            });
        }
    };
};

// Action to get following users
export const getFollowingUsers = (values, callBack) => {
    return async (dispatch, getState) => {
        // Check if following users are already fetched
        console.log("Ja zovem vala values: ", values)
        const { following_posts_reducer } = getState();
        if (!following_posts_reducer || !following_posts_reducer.following || following_posts_reducer.following.length === 0) {
            // Following users not fetched or empty, proceed with fetching
            const config = setConfig(getState);
            console.log("Received values: ", values);
            try {
                const res = await axios.get(`user/${values.userId}/following_users/`, { params: values }, config);
                dispatch({
                    type: GET_FOLLOWING_USERS,
                    payload: res.data
                });
                if (callBack && typeof callBack === 'function') {
                    callBack();
                }
            } catch (error) {
                dispatch({
                    type: GET_FOLLOWING_USERS_FAILED,
                    payload: error.response ? error.response.data : 'Unexpected error occurred'
                });
            }
        }
    };
};


// export const createFollow = (values) => {
//     return async (dispatch, getState) => {
//         const config = setConfig(getState);
//         const { targetUser } = values; // Assuming values is an object containing targetUser

//         // Check if the user is already following the targetUser
//         const { following_posts_reducer } = getState();
//         const isAlreadyFollowing = following_posts_reducer.following.some(user => user.id === targetUser.id);

//         // If not already following, proceed with creating the follow
//         if (!isAlreadyFollowing) {
//             try {
//                 const res = await axios.post('follow/', values, config);
//                 dispatch({
//                     type: CREATE_FOLLOW,
//                     payload: res.data
//                 });
//             } catch (error) {
//                 dispatch({
//                     type: CREATE_FOLLOW_FAILED,
//                     payload: error.response ? error.response.data : 'Unexpected error occurred'
//                 });
//             }
//         } else {
//             console.log("Already following the user");
//             // Optionally, you can dispatch an action or handle this case differently
//         }
//     };
// };
export const createFollow = (values) => {
    return async (dispatch, getState) => {
        const config = setConfig(getState);
        try {
            const res = await axios.post('follow/', values, config);
            dispatch({
                type: CREATE_FOLLOW,
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: CREATE_FOLLOW_FAILED,
                payload: error.response ? error.response.data : 'Unexpected error occurred'
            });
        }
    };
};

export const deleteFollow = (followerId, followeeId) => {
    return async (dispatch, getState) => {
        const config = setConfig(getState);
        console.log("Sa druge strane jastoga: ", followerId)
        console.log("Sa druge strane jastoga 2: ", followeeId)
        try {
            const res = await axios.post('follow/delete_follow/', { user_id: followerId, target_user_id: followeeId }, config);
            dispatch({
                type: DELETE_FOLLOW_SUCCESS,
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_FOLLOW_FAILED,
                payload: error.response ? error.response.data : 'Unexpected error occurred'
            });
        }
    };
};
