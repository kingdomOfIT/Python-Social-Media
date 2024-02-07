import {
    GET_FOLLOWING_POSTS, CREATE_FOLLOW, DELETE_FOLLOW, CREATE_FOLLOW_FAILED, GET_FOLLOWING_USERS, DELETE_FOLLOW_SUCCESS
} from "../actions/types"

export default function (state = { posts: [], follows: [] }, action) {

    let posts = state.posts;
    let follow;
    let followIndex;

    switch (action.type) {
        case GET_FOLLOWING_POSTS:
            return {
                ...state,
                follows: action.payload,
            };
        case CREATE_FOLLOW:
            const followPostsToAdd = action.payload;
            return {
                ...state,
                follows: [posts, ...state.posts]
            };
        case GET_FOLLOWING_USERS:
            return {
                ...state,
                following: action.payload,
            };

        case DELETE_FOLLOW_SUCCESS:
            return {
                ...state,
                follows: [posts, ...state.posts]
            };
            
        default:
            return state
    }
}   


