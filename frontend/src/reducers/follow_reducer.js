import {
    GET_FOLLOWING_POSTS, CREATE_FOLLOW, DELETE_FOLLOW_SUCCESS, GET_FOLLOWING_USERS, MAKE_LIKE, DELETE_LIKE
} from "../actions/types"

const initialState = {
    posts: [],
    follows: [],
    following: [],
    nextPage: null
};

export default function (state = initialState, action) {
    let posts = state.posts.slice();
    let following = state.following.slice();
    let postIndex;

    switch (action.type) {
        case GET_FOLLOWING_POSTS:
            return {
                ...state,
                follows: action.payload,
            };
            
        case CREATE_FOLLOW:
            const newFollow = {"id": action.payload.targetUser}

            // Check if the new follow already exists in the array
            if (!following.some(follow => follow.id === newFollow.id)) {
                // If it doesn't exist, add it to the array
                following.push(newFollow);
            }
            return {
                ...state,
                following: following
            };
        case GET_FOLLOWING_USERS:
            // Filter out duplicates based on the user's id before merging with the existing state
            const uniqueFollowing = action.payload.filter(newFollow => !state.following.some(follow => follow.id === newFollow.id));
            return {
                ...state,
                following: [...state.following, ...uniqueFollowing],
            };
        case DELETE_FOLLOW_SUCCESS:
            const { targetUserId } = action.payload;
            const updatedFollowing = state.following.filter(follow => follow.id !== targetUserId);
            return {
                ...state,
                following: updatedFollowing
            };
        case MAKE_LIKE:
        case DELETE_LIKE:
            postIndex = posts.findIndex((post) => (post.id === action.payload.id))
            if (postIndex !== -1 ) {
                posts.splice(postIndex, 1, action.payload)
            } 
            return {
                ...state,
                posts
            }
        default:
            return state
    }
}
