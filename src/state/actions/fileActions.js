import {
  UPLOAD_FILE,
  DELETE_FILE,
  ATTACH_FILE_TO_THREAD,
  REMOVE_FILE_FROM_THREAD,
} from "./actionTypes";

export const uploadFile = (file) => {
  return {
    type: UPLOAD_FILE,
    file,
  };
};

export const deleteFile = (file) => {
  return {
    type: DELETE_FILE,
    file,
  };
};

export const attachFileToThread = (file, threadId) => {
  return {
    type: ATTACH_FILE_TO_THREAD,
    file,
    threadId,
  };
};

export const removeFileFromThread = (file, threadId) => {
  return {
    type: REMOVE_FILE_FROM_THREAD,
    file,
    threadId,
  };
};
