import { SET_MODE } from "./actionTypes";

export const setMode = (mode) => {
  return {
    type: SET_MODE,
    mode,
  };
};
