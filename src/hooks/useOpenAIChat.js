import { useContext, useState } from "react";

import { v4 as uuidv4 } from "uuid";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../state/AppContext";
import { ADD_MESSAGE, CREATE_NEW_THREAD } from "../state/actions/actionTypes";

// Hooks
import usePushCurrentThread from "./usePushCurrentThread";

// Amplify API
import { API, Auth } from "aws-amplify";

const useOpenAIChat = () => {
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(false);

  const state = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  const { setUpdateCurrentThread } = usePushCurrentThread();

  const myAPI = `trainicityAiAPI`;
  const path = `/chatGPT4`;

  const fetchChat = async (userMessage) => {
    setChatLoading(true);
    setChatError(false);

    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;

    const messageID = uuidv4();

    dispatch({
      type: ADD_MESSAGE,
      payload: { role: "user", content: userMessage, messageID: messageID },
    });

    const updatedMessages = [
      ...state.threadData.currentThread.messages,
      { role: "user", content: userMessage },
    ];

    const init = {
      body: updatedMessages,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    API.post(myAPI, path, init)
      .then((response) => {
        const assistantContent = response.completionText;
        const assistantMessageID = uuidv4();
        dispatch({
          type: ADD_MESSAGE,
          payload: {
            role: "assistant",
            content: assistantContent,
            messageID: assistantMessageID,
          },
        });
        setChatLoading(false);
        setUpdateCurrentThread(true);
      })
      .catch((error) => {
        setChatError(true);
        console.log("API Error: ", error);
        setChatLoading(false);
      });
  };

  return {
    fetchChat,
    chatLoading,
    chatError,
  };
};

export default useOpenAIChat;
