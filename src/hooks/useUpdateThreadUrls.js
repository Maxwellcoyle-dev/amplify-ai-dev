import { useState } from "react";

// Custom Hooks
import useGetThread from "./useGetThread";

// Amplify API
import { API, Auth } from "aws-amplify";

const useUpdateThreadUrls = () => {
  const [updateUrlListLoading, setUpdateUrlListLoading] = useState(false);
  const [updateUrlListError, setUpdateUrlListError] = useState(null);

  const { getThread } = useGetThread();

  const myAPI = `trainicityAiAPI`;
  const path = `/updateThreadUrls`;

  const updateThreadUrls = async (urlList, threadID) => {
    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const userID = user.attributes.email; // Get the current user's email for userID
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!urlList) return console.log("No urlList"); // Check for a urlList
    if (!threadID) return console.log("No threadID"); // Check for a threadID

    setUpdateUrlListLoading(true);
    setUpdateUrlListError(null);

    try {
      const init = {
        body: {
          threadID: threadID,
          userID: userID,
          urls: urlList,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("init: ", init);
      API.post(myAPI, path, init)
        .then((response) => {
          console.log("response: ", response);
        })
        .catch((error) => {
          console.log("error: ", error);
          setUpdateUrlListError(error);
        })
        .finally(() => {
          setUpdateUrlListLoading(false);
          getThread(threadID);
        });
    } catch (error) {
      console.log(error);
      setUpdateUrlListError(error);
      setUpdateUrlListLoading(false);
    }
  };

  return { updateThreadUrls, updateUrlListLoading, updateUrlListError };
};

export default useUpdateThreadUrls;
