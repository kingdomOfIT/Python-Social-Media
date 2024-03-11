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

export const fetchFollowingPosts = (values) => {
    return async (dispatch, getState) => {
        const config = setConfig(getState);
        try {
            const res = await axios.get('follow/following_posts/', { params: values }, config);
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
        console.log("Ja zovem vala")
        const { following_posts_reducer } = getState();
        if (!following_posts_reducer || !following_posts_reducer.following || following_posts_reducer.following.length === 0) {
            // Following users not fetched or empty, proceed with fetching
            const config = setConfig(getState);
            console.log("Received values: ", values);
            try {
                const res = await axios.get('follow/following_users/', { params: values }, config);
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
