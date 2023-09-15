import { SET_MODE } from "../actions/actionTypes";

const initialState = {
  currentMode: "default",
};

const modeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE:
      return { ...state, currentMode: action.payload };
    default:
      return state;
  }
};

export default modeReducer;
