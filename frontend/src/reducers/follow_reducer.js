import {
    GET_FOLLOWING_POSTS, CREATE_FOLLOW, DELETE_FOLLOW, CREATE_FOLLOW_FAILED, GET_FOLLOWING_USERS, DELETE_FOLLOW_SUCCESS, MAKE_LIKE, DELETE_LIKE
} from "../actions/types"

const initialState = {
    posts: [],
    follows: [],
    nextPage: null  // Initialize nextPage to null or some initial value
};

export default function (state = initialState, action) {

    let posts = state.posts.slice();  // Make a copy of posts array to avoid mutating state directly
    let follow;
    let followIndex;
    let postIndex;

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
        
        case MAKE_LIKE:
        case DELETE_LIKE:
            postIndex = posts.findIndex((post) => (post.id === action.payload.id))
            console.log("Ero s onog: ", postIndex)
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
