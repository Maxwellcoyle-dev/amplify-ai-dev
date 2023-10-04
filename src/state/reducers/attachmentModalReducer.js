import {
  SHOW_ATTACHMENT_MODAL,
  HIDE_ATTACHMENT_MODAL,
} from "../actions/actionTypes";

const initialState = false;

const attachmentModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ATTACHMENT_MODAL:
      // Set showAttachmentModal to true
      return true;

    case HIDE_ATTACHMENT_MODAL:
      // Set showAttachmentModal to false
      return false;
    default:
      return state;
  }
};

export default attachmentModalReducer;
