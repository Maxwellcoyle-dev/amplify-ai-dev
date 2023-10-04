import { SHOW_ATTACHMENT_MODAL, HIDE_ATTACHMENT_MODAL } from "./actionTypes";

export const setShowAttachmentModal = (show) => {
  return {
    type: SHOW_ATTACHMENT_MODAL,
    mode,
  };
};

export const setHideAttachmentModal = (hide) => {
  return {
    type: HIDE_ATTACHMENT_MODAL,
    mode,
  };
};
