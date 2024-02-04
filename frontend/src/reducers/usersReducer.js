import {
  LIST_USERS, GET_USER_BY_USER_ID
} from "../actions/types"

const initialState = {
    users: [], // data fetched by listUsers
  };
  
  const usersReducer = (state = initialState, action) => {
    switch (action.type) {
      case LIST_USERS:
        return {
          ...state,
          users: action.payload,
        };
      // handle other cases as needed
      default:
        return state;
    }
  };
  
  export default usersReducer;
  