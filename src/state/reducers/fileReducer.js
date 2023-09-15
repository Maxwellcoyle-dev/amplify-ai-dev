import {
  UPLOAD_FILE,
  DELETE_FILE,
  ATTACH_FILE_TO_THREAD,
  REMOVE_FILE_FROM_THREAD,
} from "../actions/actionTypes";

const initialState = {
  files: [], // An array of all uploaded files
  threadFiles: [], // An object mapping thread IDs to their attached files
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_FILE:
      return { ...state, files: [...state.files, action.payload] };

    case DELETE_FILE:
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload.id),
        threadFiles: Object.fromEntries(
          Object.entries(state.threadFiles).map(([threadId, files]) => [
            threadId,
            files.filter((file) => file.id !== action.payload),
          ])
        ),
      };

    case ATTACH_FILE_TO_THREAD:
      return {
        ...state,
        threadFiles: {
          ...state.threadFiles,
          [action.payload.threadId]: [
            ...(state.threadFiles[action.payload.threadId] || []),
            action.payload.file,
          ],
        },
      };

    case REMOVE_FILE_FROM_THREAD:
      return {
        ...state,
        threadFiles: {
          ...state.threadFiles,
          [action.payload.threadId]: state.threadFiles[
            action.payload.threadId
          ].filter((file) => file.id !== action.payload.file.id),
        },
      };

    default:
      return state;
  }
};

export default fileReducer;
