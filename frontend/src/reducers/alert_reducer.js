import { CLOSEALERT, LOGIN_ERROR, REGISTER_ERROR,
    UPDATE_USER_ERROR, POST_CREATED_FAILED, DELETE_POST, EDIT_POST_FAIL , REGISTER,
    EDIT_POST, UPDATE_USER_INFO, UPDATE_IMAGE}
from "../actions/types"

let msg = null
const init = {
    type : null,
    msg
}

export default function(state = init , action) {
    switch(action.type){

        case UPDATE_USER_ERROR:
            msg = action.payload.username ? action.payload.username.join() : action.payload.error.join()
            return{
                type : 'error',
                msg
            }

        case LOGIN_ERROR:
            if(action.payload.non_field_errors) {
                msg = action.payload.non_field_errors
            } else {
                msg = "Oops! Don't forget your username and password! 🚀"
            }
            return {
                ...state,
                type : "error",
                msg
            }
        
        case REGISTER_ERROR:
            msg = "Oops! Looks like that file isn't an image. 🖼️ Please upload an image for your profile!"
            return {
                type: "error",
                msg 
            }

        case EDIT_POST_FAIL:
            msg = action.payload.non_field_errors.join()
            return {
                type: "error",
                msg
            }

        case DELETE_POST:
            msg = "Mission Accomplished: Post Deleted! ✨"
            return {
                type: "success",
                msg
            }
        
        case REGISTER:
            msg = "Hey there! 📩 Time to double-check your inbox and give that email a thumbs-up! 📬✅"
            return {
                type: "success",
                msg
            }

        case CLOSEALERT:
            return init

        case UPDATE_USER_INFO:
        case UPDATE_IMAGE:
            msg = `🚀 Boom! ${action.payload.username}, your profile has been turbocharged! Update complete. 🌟`
            return {
                type: "success",
                msg
            }

        default :
            return state
    }
}