import { SET_USER } from "../actions/actionTypes";

export const initialState = {
  user: {
    userID: "",
    token: "",
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userID: action.payload.userID,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export default userReducer;
