import {
  GET_USER, GET_USER_BY_USER_ID
} from "../actions/types"

const initialState = {
    user: null, // data fetched by getUser
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_USER:
        return {
          ...state,
          user: action.payload,
        };
      case GET_USER_BY_USER_ID:
        return {
            ...state,
            isAuthenticated : true,
            userByUserId : action.payload,
            isLoading : false
        }
      // handle other cases as needed
      default:
        return state;
    }
  };
  
  export default userReducer;
  