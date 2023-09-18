import { useState } from "react";

// Amplify API
import { API, Auth } from "aws-amplify";

// Custom Hooks
import useGetThread from "./useGetThread";

const useDeleteFile = () => {
  const [fileDeleteLoading, setFileDeleteLoading] = useState(false);
  const [fileDeleteError, setFileDeleteError] = useState(null);

  const { getThread } = useGetThread();

  const myAPI = `trainicityAiAPI`;
  const path = `/deleteFile`;

  const deleteFile = async (fileKey, threadID) => {
    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!token) return console.log("No token"); // Check for a token
    if (!threadID) return console.log("No threadID"); // Check for a threadID

    setFileDeleteLoading(true);
    setFileDeleteError(null);

    const init = {
      body: {
        fileKey: fileKey,
        threadID: threadID,
        userID: user.attributes.email,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await API.post(myAPI, path, init);
      console.log(response);
    } catch (error) {
      console.log(error);
      setFileDeleteError(error);
    } finally {
      setFileDeleteLoading(false);
      getThread(threadID);
    }
  };

  return { fileDeleteLoading, fileDeleteError, deleteFile };
};

export default useDeleteFile;
