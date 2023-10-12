import { v4 as uuidv4 } from "uuid";

import {
  SET_THREADS,
  ADD_THREAD,
  DELETE_THREAD,
  ADD_MESSAGE,
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  RESET_CURRENT_THREAD,
  CREATE_NEW_THREAD,
  SET_CURRENT_THREAD_ID,
  GET_CURRENT_THREAD,
  SET_THREAD_TITLE,
  UPDATE_THREAD_LASTUPDATED,
  SET_CURRENT_THREAD_URLS,
} from "../actions/actionTypes";

export const initialState = {
  threads: [],
  currentThread: {
    threadID: "",
    threadTitle: "",
    messages: [],
    lastUpdated: "",
    files: [],
    urls: [],
    threadMode: "",
    threadInstructions: "",
  },
};

const threadReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_THREAD:
      console.log(action.payload);
      // payload - threadTitle, threadMode, threadInstructions
      const givenTitle = action.payload.threadTitle;
      const threadMode = action.payload.threadMode;
      const threadInstructions = action.payload.threadInstructions;

      const newThreadID = uuidv4();
      // Set the lastUpdated and deafult title details
      const lastUpdated = Date.now().toString();
      const parsedTimestamp = parseInt(lastUpdated);
      const newTimestamp = new Date(parsedTimestamp).toLocaleDateString(
        "en-US"
      );
      const newTime = new Date(parsedTimestamp).toLocaleTimeString();
      const defaultTitle = `${newTimestamp} ${newTime}`;

      const newThreadContent = {
        threadID: newThreadID,
        threadTitle: givenTitle !== "" ? givenTitle : defaultTitle,
        lastUpdated,
        threadMode,
        threadInstructions,
      };
      console.log(newThreadContent);

      return {
        ...state,
        currentThread: newThreadContent,
      };

    case ADD_MESSAGE:
      const timeStamp = new Date().getTime().toString();

      // Check if a message array exists in the currentThread object
      if (!state.currentThread.messages) {
        const newMessageArray = [
          {
            role: action.payload.role,
            content: action.payload.content,
            messageID: action.payload.messageID,
          },
        ];

        return {
          ...state,
          currentThread: {
            ...state.currentThread,
            messages: newMessageArray,
            lastUpdated: timeStamp,
          },
        };
      } else if (
        state.currentThread.messages[state.currentThread.messages?.length - 1]
          .messageID === action.payload.messageID
      ) {
        const updatedMessages = [
          ...state.currentThread.messages?.slice(0, -1),
          {
            role: action.payload.role,
            content: action.payload.content,
            messageID: action.payload.messageID,
          },
        ];
        // Create a new currentThread object with the updatedMessages array
        const updatedThread = {
          ...state.currentThread,
          messages: updatedMessages,
          lastUpdated: timeStamp,
        };
        return {
          ...state,
          currentThread: updatedThread,
        };
      } else {
        const updatedMessages = [
          ...state.currentThread.messages,
          {
            role: action.payload.role,
            content: action.payload.content,
            messageID: action.payload.messageID,
          },
        ];
        // Create a new currentThread object with the updatedMessages array
        const updatedThread = {
          ...state.currentThread,
          messages: updatedMessages,
          lastUpdated: timeStamp,
        };
        return {
          ...state,
          currentThread: updatedThread,
        };
      }

    case RESET_CURRENT_THREAD:
      return {
        ...state,
        currentThread: {
          threadID: "",
          threadTitle: "",
          messages: [],
          lastUpdated: "",
          files: [],
          urls: [],
          threadMode: "",
          threadInstructions: "",
        },
      };

    case SET_THREADS:
      // Sort the threads by the lastUpdated property
      const sortedThreads = action.payload.sort((a, b) => {
        return b.lastUpdated - a.lastUpdated;
      });
      // check if the sortedThreads is different from the current threads array
      if (sortedThreads === state.threads) return;

      return { ...state, threads: sortedThreads };

    case DELETE_THREAD:
      try {
        const newState = {
          ...state,
          threads: state.threads.filter(
            (thread) => thread.threadID !== action.payload.threadID
          ),
        };
        return {
          newState,
        };
      } catch (err) {
        console.error(err);
      }

    case ADD_THREAD:
      const newThread = {
        threadID: action.payload.ThreadID,
        threadTitle: action.payload.ThreadTitle,
        lastUpdated: action.payload.LastUpdated,
        userID: action.payload.UserID,
      };
      // Check if the thread already exists
      const threadExists = state.threads.find(
        (thread) => thread.threadID === newThread.threadID
      );
      // If it doesn't exist then add it to the threads array
      if (threadExists) {
        return {
          ...state,
          threads: [...state.threads],
        };
      } else {
        return {
          ...state,
          threads: [...state.threads, newThread],
        };
      }

    case DELETE_MESSAGE:
      // Filter out the message that matches the messageID
      const updatedMessagesArray = state.currentThread.messages.filter(
        (message) => message.messageID !== action.payload
      );
      // Create a new currentThread object with the updatedMessages array
      const updatedThreadObject = {
        ...state.currentThread,
        messages: updatedMessagesArray,
      };
      return {
        ...state,
        currentThread: updatedThreadObject,
      };

    case EDIT_MESSAGE:
      // find the index of the message that matches the messageID
      const messageIndex = state.currentThread.messages.findIndex(
        (message) => message.messageID === action.payload.messageID
      );

      // If messageIndex is -1, it means the messageID does not exist in the array
      if (messageIndex === -1) {
        console.error("MessageID not found");
        return state;
      }

      // Create a new message object with the updated content
      const updatedMessage = {
        ...state.currentThread.messages[messageIndex],
        content: action.payload.content,
      };

      // Create a new messages array with the updated message
      const updatedMessagesArray2 = [
        ...state.currentThread.messages.slice(0, messageIndex),
        updatedMessage,
        ...state.currentThread.messages.slice(messageIndex + 1),
      ];

      // Create a new currentThread object with the updatedMessages array
      const updatedThreadObject2 = {
        ...state.currentThread,
        messages: updatedMessagesArray2,
      };

      return {
        ...state,
        currentThread: updatedThreadObject2,
      };

    case GET_CURRENT_THREAD:
      const newCurrentThread = {
        threadID: action.payload.ThreadID.S,
        threadTitle: action.payload.ThreadTitle.S,
        messages: action.payload.Messages?.L?.map((message) => ({
          role: message.M?.role?.S,
          content: message.M?.content?.S,
          messageID: message.M?.messageID?.S,
        })),
        files: action.payload.Files?.L?.map((file) => ({
          fileName: file?.M?.fileName?.S,
          fileURL: file?.M?.fileURL?.S,
          fileKey: file?.M?.fileKey?.S,
        })),
        urls: action.payload.URLs?.L?.map((url) => ({
          url: url?.M?.url?.S,
        })),
        lastUpdated: action.payload.LastUpdated.S,
        threadMode: action.payload.ThreadMode.S,
        threadInstructions: action.payload.ThreadInstructions.S,
      };

      return {
        ...state,
        currentThread: newCurrentThread,
      };

    case SET_CURRENT_THREAD_ID:
      const updatedThreadID = action.payload;
      return {
        ...state,
        currentThread: {
          threadID: updatedThreadID,
        },
      };

    case UPDATE_THREAD_LASTUPDATED:
      const updatedLastUpdated = action.payload;
      return {
        ...state,
        currentThread: {
          ...state.currentThread,
          lastUpdated: updatedLastUpdated,
        },
      };

    case SET_THREAD_TITLE:
      const updatedThreadTitle = action.payload.threadTitle;
      const newThreadsArray = state.threads.map((thread) => {
        if (thread.threadID === action.payload.threadID) {
          thread.threadTitle = updatedThreadTitle;
        }
        return thread;
      });

      return {
        ...state,
        threads: newThreadsArray,
        currentThread: {
          ...state.currentThread,
          threadTitle: updatedThreadTitle,
        },
      };

    case SET_CURRENT_THREAD_URLS:
      const updatedURLS = action.payload;
      return {
        ...state,
        currentThread: {
          ...state.currentThread,
          urls: updatedURLS,
        },
      };

    default:
      return state;
  }
};

export default threadReducer;
