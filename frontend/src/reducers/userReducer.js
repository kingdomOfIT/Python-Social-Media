import {
  GET_USER
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
      // handle other cases as needed
      default:
        return state;
    }
  };
  
  export default userReducer;
  