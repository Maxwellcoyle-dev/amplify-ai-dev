import userReducer from "./userReducer";
import threadReducer from "./threadReducer";
import fileReducer from "./fileReducer";
import modeReducer from "./modeReducer";

const rootReducer = (state, action) => ({
  user: userReducer(state.user, action),
  threadData: threadReducer(state.threadData, action),
  files: fileReducer(state.files, action),
  mode: modeReducer(state.mode, action),
});

export default rootReducer;
