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

  const myAPI = `threadapi`;
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
    const currentThreadID = threadData.currentThread.threadID; // Get the current threadID
    const currentThreadMessages = threadData.currentThread.messages; // Get the current thread messages
    const threadTitle = threadData.currentThread.threadTitle; // Get the current thread title

    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const userID = user.attributes.email; // Get the current user's email for userID
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!token) return console.log("No token"); // Check for a token
    if (!currentThreadID) return console.log("No threadID"); // Check for a threadID

    // Set the lastUpdated timestamp
    const lastUpdated = Date.now().toString();

    // Set a default title using the date + time of the last edit
    const timestamp = lastUpdated;
    const parsedTimestamp = parseInt(timestamp);
    const newTimestamp = new Date(parsedTimestamp).toLocaleDateString("en-US");
    const newTime = new Date(parsedTimestamp).toLocaleTimeString();
    const defaultTitle = `${newTimestamp} ${newTime}`;

    const init = {
      body: {
        threadID: currentThreadID,
        userID: userID,
        messages: currentThreadMessages,
        lastUpdated: lastUpdated,
        threadTitle: threadTitle || defaultTitle,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    API.post(myAPI, path, init)
      .then((response) => {
        console.log("response: ", response);
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
