import {
  SET_THREADS,
  ADD_THREAD,
  SET_CURRENT_THREAD_ID,
  UPDATE_THREAD_LASTUPDATED,
  RESET_CURRENT_THREAD,
  SET_THREAD_TITLE,
  GET_CURRENT_THREAD,
  CREATE_NEW_THREAD,
  DELETE_THREAD,
  ADD_MESSAGE,
  ADD_MESSAGE_STREAM,
  ADD_ASSISTANT_RESPONSE,
  DELETE_MESSAGE,
  SET_CURRENT_THREAD_URLS,
  EDIT_MESSAGE,
} from "./actionTypes";

export const setThreads = (threads) => {
  return {
    type: SET_THREADS,
    threads,
  };
};

export const createNewThread = (thread) => {
  return {
    type: CREATE_NEW_THREAD,
    thread,
  };
};

export const addThreads = (threads) => {
  return {
    type: ADD_THREAD,
    threads,
  };
};

export const setCurrentThread = (thread) => {
  return {
    type: SET_CURRENT_THREAD_ID,
    thread,
  };
};

export const setCurrentThreadUrls = (thread) => {
  return {
    type: SET_CURRENT_THREAD_URLS,
    thread,
  };
};

export const updateThreadLastUpdated = (thread) => {
  return {
    type: UPDATE_THREAD_LASTUPDATED,
    thread,
  };
};

export const getCurrentThread = (thread) => {
  return {
    type: GET_CURRENT_THREAD,
    thread,
  };
};

export const resetCurrentThread = (thread) => {
  return {
    type: RESET_CURRENT_THREAD,
    thread,
  };
};

export const deleteThread = (thread) => {
  return {
    type: DELETE_THREAD,
    thread,
  };
};

export const setThreadTitle = (thread) => {
  return {
    type: SET_THREAD_TITLE,
    thread,
  };
};

export const addMessage = (content) => {
  return {
    type: ADD_MESSAGE,
    content,
  };
};

export const addMessageStream = (content) => {
  return {
    type: ADD_MESSAGE_STREAM,
    content,
  };
};

export const addAssistantResponse = (content) => {
  return {
    type: ADD_ASSISTANT_RESPONSE,
    content,
  };
};

export const deleteMessage = (message) => {
  return {
    type: DELETE_MESSAGE,
    message,
  };
};

export const editMessage = (message) => {
  return {
    type: EDIT_MESSAGE,
    message,
  };
};
