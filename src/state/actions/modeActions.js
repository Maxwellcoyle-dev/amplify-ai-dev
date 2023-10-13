import { SET_MODE, SET_MODEL } from "./actionTypes";

export const setMode = (mode) => {
  return {
    type: SET_MODE,
    mode,
  };
};

export const setModel = (model) => {
  return {
    type: SET_MODEL,
    model,
  };
};
