import userReducer from "./userReducer";
import threadReducer from "./threadReducer";
import modeReducer from "./modeReducer";
import attachmentModalReducer from "./attachmentModalReducer";

const rootReducer = (state, action) => ({
  user: userReducer(state.user, action),
  threadData: threadReducer(state.threadData, action),
  mode: modeReducer(state.mode, action),
  showAttachmentModal: attachmentModalReducer(
    state.showAttachmentModal,
    action
  ),
});

export default rootReducer;
