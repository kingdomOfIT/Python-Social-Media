import axios from "axios"

import { CLOSEALERT, UPDATE_USER_INFO, UPDATE_USER_ERROR, CLEAR_REDUX_FORM,
    UPDATE_IMAGE, UPDATE_IMAGE_FAIL, MAKE_LIKE, UPDATE_LIKE ,DELETE_LIKE, UPDATE_SAVE, DELETE_SAVE, SAVE}
from "./types"
import { setConfig } from "./auth_actions"

export const closeAlert = () => {
    return (dispatch) =>{
        dispatch({
            type: CLOSEALERT,
            payload : null
         })     
    } 
}   

export const updateUserInfo = (body , userId ,callBack ,stopProgress) => {
    return (dispatch ,getState ) => {
        const config = setConfig(getState)
        axios.post(`user/${userId}/update/` ,body ,config).then( (res) => {
            dispatch({
                type : UPDATE_USER_INFO,
                payload : res.data
            })
            callBack()
        }, (err) => {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: err.response.data
            })
            stopProgress()
        })
    }
}


// update the user image
export const updateUserImage = (values ,user_id ,callBack) => {
    return (dispatch ,getState) => {
        const config = setConfig(getState)
        axios.post(`user/${user_id}/update-image/`,values ,config).then( (res) => {
            callBack()
            dispatch({
                type : UPDATE_IMAGE,
                payload : res.data.user
            })
        } ,(err) => console.log(err.response))
    }
}

// clear data in redux form
export const clearForm = () => {
    return { type: CLEAR_REDUX_FORM }
}

/*******************************
 *          LIKES ACTIONS
 *******************************/
 export const makeLike = (values) => {
    return (dispatch ,getState) => {
        const config = setConfig(getState)
        axios.post("like/",values,config)
        .then((res)=> {
            dispatch({
                type : MAKE_LIKE,
                payload : res.data
            })
        })
        .catch((error) => {
            console.error("Error making like:", error);
          });
    }
}

export const deleteLike = (id) => {
    return (dispatch, getState) => {
        const config = setConfig(getState)
        axios.delete(`like/${id}/`, config).then((res) => {
            dispatch({
                type: DELETE_LIKE,
                payload: res.data
            })
        })
    }
}


/*******************************
 *          SAVE ACTIONS
 *******************************/
export const savePost = (values) => {
    return (dispatch ,getState) => {
        const config = setConfig(getState)
        axios.post("save/",values,config)
        .then((res)=> {
            dispatch({
                type : SAVE,
                payload : res.data
            })
        })
        .catch((error) => {
            console.error("Error making like:", error);
          });
    }
}

export const deleteSave = (id) => {
    return (dispatch, getState) => {
        const config = setConfig(getState)
        axios.delete(`save/${id}/`, config).then((res) => {
            dispatch({
                type: DELETE_SAVE,
                payload: res.data
            })
        })
    }
}