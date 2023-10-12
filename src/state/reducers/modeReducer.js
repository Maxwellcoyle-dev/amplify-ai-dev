import { SET_MODE, SET_MODEL } from "../actions/actionTypes";

const initialState = {
  mode: "",
  model: "gpt-3.5-turbo-16k",
};

const modeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE:
      return { ...state, mode: action.payload };
    case SET_MODEL:
      return { ...state, model: action.payload };
    default:
      return state;
  }
};

export default modeReducer;
