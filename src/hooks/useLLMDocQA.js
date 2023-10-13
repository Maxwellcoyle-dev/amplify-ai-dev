import { useContext, useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../state/AppContext";
import { ADD_MESSAGE } from "../state/actions/actionTypes";

// Amplify API
import { Auth } from "aws-amplify";

// Hooks
import usePushCurrentThread from "./usePushCurrentThread";

const URL =
  "https://ol62tnwqr2jpnenz2t3lqwpnqm0fecjc.lambda-url.us-east-2.on.aws/";

// Payload to send to the backend
// {
//   files: ["string"],
//   question: "string",
//   userID: "string",
//   threadID: "string",
// };

const useLLMDocQA = () => {
  const [docQALoading, setDocQALoading] = useState(false);
  const [docQAError, setDocQAError] = useState(false);
  const [controller, setController] = useState(null);

  // establish state and dispatcher from AppContext
  const dispatch = useContext(AppDispatchContext);
  const state = useContext(AppStateContext);

  // get the fileKeys to send to the backend
  const files = state.threadData?.currentThread.files;
  let fileKeyList = [];
  if (files) fileKeyList = files?.map((file) => file.fileKey);

  // define setUpdateCurrentThread to update the current thread after a message is recieved
  const { setUpdateCurrentThread } = usePushCurrentThread();

  const fetchDocQA = async (userMessage) => {
    setDocQALoading(true);
    setDocQAError(false);

    // Create a unique message ID
    const messageID = uuidv4();
    dispatch({
      type: ADD_MESSAGE,
      payload: { role: "user", content: userMessage, messageID: messageID },
    });

    try {
      // Get the auth user's email + the currentThread > threadID
      const user = await Auth.currentAuthenticatedUser();
      const userID = user.attributes.email; // Get the current user's email for userID
      const threadID = state.threadData.currentThread.threadID;
      const threadInstructions = state.threadData.currentThread.instructions;

      if (fileKeyList.length === 0) return "No files";
      console.log(fileKeyList);

      const init = {
        files: fileKeyList,
        question: userMessage,
        instructions: threadInstructions,
        userID,
        threadID,
      };

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(init),
      });

      const data = await response.json();
      console.log(data);
      // Create a unique message ID
      const assistantMessageID = uuidv4();
      dispatch({
        type: ADD_MESSAGE,
        payload: {
          role: "assistant",
          content: data.text,
          messageID: assistantMessageID,
        },
      });
      setDocQALoading(false);
    } catch (error) {
      console.log(error);
      setDocQAError(true);
      setDocQALoading(false);
    }
  };

  return {
    fetchDocQA,
    docQALoading,
    docQAError,
  };
};

export default useLLMDocQA;
