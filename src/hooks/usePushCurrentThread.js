import { useContext, useEffect, useState } from "react";

// Hooks
import useGetThreads from "./useGetThreads";

// Context & Actions
import { AppStateContext } from "../state/AppContext";

// Amplify API
import { API, Auth } from "aws-amplify";

const usePushCurrentThread = () => {
  const [updateCurrentThread, setUpdateCurrentThread] = useState(false);

  const { getThreads } = useGetThreads();
  const { threadData } = useContext(AppStateContext);

  const myAPI = `trainicityAiAPI`;
  const path = `/currentThread`;

  useEffect(() => {
    if (updateCurrentThread) {
      pushThread();
      setUpdateCurrentThread(false);
    }
  }, [updateCurrentThread]);

  const pushThread = async () => {
    console.log("Pushing thread");
    console.log(threadData.currentThread);
    const threadID = threadData.currentThread.threadID; // Get the current threadID
    const currentThreadMessages = threadData.currentThread.messages; // Get the current thread messages
    const threadTitle = threadData.currentThread.threadTitle; // Get the current thread title
    const threadMode = threadData.currentThread.threadMode; // Get the current thread mode
    const threadInstructions = threadData.currentThread.threadInstructions; // Get the current thread instructions

    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const userID = user.attributes.email; // Get the current user's email for userID
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!token) return console.log("No token"); // Check for a token
    if (!threadID) return console.log("No threadID"); // Check for a threadID

    // Set the lastUpdated timestamp
    const lastUpdated = Date.now().toString();

    const init = {
      body: {
        threadID,
        userID,
        messages: currentThreadMessages,
        lastUpdated,
        threadTitle,
        threadMode,
        threadInstructions,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    API.post(myAPI, path, init)
      .then((response) => {
        console.log(response);
        getThreads();
      })
      .catch((error) => console.log(error));
  };

  return {
    pushThread,
    setUpdateCurrentThread,
    updateCurrentThread,
  };
};

export default usePushCurrentThread;
