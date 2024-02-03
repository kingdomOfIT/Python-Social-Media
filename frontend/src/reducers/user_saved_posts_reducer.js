import {
    GET_USER_POSTS, MAKE_LIKE, UPDATE_LIKE, DELETE_LIKE,
    DELETE_POST, EDIT_POST, ADD_COMMENT, DELETE_COMMENT, SAVE, DELETE_SAVE, GET_USER_SAVED_POSTS
} from "../actions/types";

export default function (state = { posts: [], savedPosts: [] }, action) {

    let postIndex;
    let posts = [...state.posts];
    let savedPosts = [...state.savedPosts];
    let post;

    switch (action.type) {

        case GET_USER_POSTS:
            return { ...state, posts: [...action.payload] };

        case DELETE_POST:
            postIndex = posts.findIndex((post) => (post.id === action.payload));
            if (postIndex > -1) {
                posts.splice(postIndex, 1);
            }
            return { ...state, posts };

        case EDIT_POST:
            postIndex = posts.findIndex((post) => (post.id === action.payload.id));
            if (postIndex > -1) {
                posts.splice(postIndex, 1, action.payload);
            }
            return { ...state, posts };

        case MAKE_LIKE:
        case UPDATE_LIKE:
        case DELETE_LIKE:
            postIndex = posts.findIndex((post) => (post.id === action.payload.id));
            if (postIndex > -1) {
                posts.splice(postIndex, 1, action.payload);
            }
            return { ...state, posts };

        case ADD_COMMENT:
            post = posts.find((post) => (post.id === action.payload.post));
            if (post !== undefined) {
                post.comments_count++;
            }
            return { ...state, posts };

        case DELETE_COMMENT:
            post = posts.find((post) => (post.id === action.payload.postId));
            if (post !== undefined) {
                post.comments_count--;
            }
            return { ...state, posts };

        case SAVE:
            const savedPostToAdd = action.payload;
            return {
                ...state,
                savedPosts: [savedPostToAdd, ...state.savedPosts]
            };
        
        case DELETE_SAVE:
            const postIdToDelete = action.payload.postId;
            const updatedSavedPosts = state.savedPosts.filter(
                (post) => post.id !== postIdToDelete
            );
            return {
                ...state,
                savedPosts: updatedSavedPosts,
            };

        case GET_USER_SAVED_POSTS:
            return {
                ...state,
                savedPosts: action.payload,
            };

        default:
            return state;
    }
}
