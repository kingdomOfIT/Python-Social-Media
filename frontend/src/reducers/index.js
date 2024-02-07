import { combineReducers } from "redux";
import { reducer as reduxformReducer } from "redux-form";
import authReducer from "./aut_reducer";
import alertReducer from "./alert_reducer";
import postsReducer from './posts_reducer';
import commentsReducer from './comments_reducer';
import userPostsReducer from "./userPosts_reducer";
import user_saved_posts_reducer from "./user_saved_posts_reducer";
import following_posts_reducer from "./follow_reducer";
import userReducer from "./userReducer";
import usersReducer from "./usersReducer";

import { CLEAR_REDUX_FORM } from "../actions/types";

export default combineReducers({
    authReducer,
    alertReducer,
    postsReducer,
    commentsReducer,
    userPostsReducer,
    userReducer,
    usersReducer,
    following_posts_reducer,
    user_saved_posts_reducer,
    form: reduxformReducer.plugin({
        register: (state, action) => {
            switch (action.type) {
                case CLEAR_REDUX_FORM:
                    return undefined;
                default:
                    return state;
            }
        }
    })
});
