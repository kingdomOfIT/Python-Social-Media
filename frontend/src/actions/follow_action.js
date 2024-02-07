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
        console.log("Pozivam 🫡")
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

export const getFollowingUsers = (values) => {
    return async (dispatch, getState) => {
        console.log("Pozivam -2 🫡")
        console.log("Values: ",values)
        const config = setConfig(getState);
        try {
            const res = await axios.get('follow/following_users/', { params: values }, config);
            dispatch({
                type: GET_FOLLOWING_USERS,
                payload: res.data
            });
        } catch (error) {
            dispatch({
                type: GET_FOLLOWING_USERS_FAILED,
                payload: error.response ? error.response.data : 'Unexpected error occurred'
            });
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
        try {
            const res = await axios.post('follow/delete_follow/', { user_id: followerId, target_user_id: followeeId }, config);
            console.log("Resdata: ", res.data)
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
