import { useContext, useState } from "react";

// Context & Actions
import { AppDispatchContext } from "../state/AppContext";
import { SET_THREADS } from "../state/actions/actionTypes";

// Amplify API
import { API, Auth } from "aws-amplify";

const myAPI = `trainicityAiAPI`;
const path = `/getThreadsList`;

const useGetThreads = () => {
  const [threadsExist, setThreadsExist] = useState(false);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState(null);

  const dispatch = useContext(AppDispatchContext);

  const getThreads = async () => {
    const user = await Auth.currentAuthenticatedUser();
    if (!user) return console.log("No user"); // Check for an Authenticated User

    setThreadsLoading(true);
    setThreadsError(null);

    const token = user.signInUserSession.idToken.jwtToken;

    const init = {
      body: {
        userID: user.attributes.email,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    API.post(myAPI, path, init)
      .then((response) => {
        if (response.length === 0) {
          setThreadsExist(false);
          setThreadsLoading(false);
          return;
        }

        setThreadsExist(true);

        const mappedResponse = response.map((item) => {
          return {
            userID: item.UserID.S,
            threadID: item.ThreadID.S,
            threadTitle: item.ThreadTitle?.S,
            lastUpdated: item.LastUpdated?.S,
          };
        });

        setThreadsLoading(false);

        dispatch({ type: SET_THREADS, payload: mappedResponse });
      })
      .catch((error) => {
        console.log(error);
        setThreadsLoading(false);
        setThreadsError(error);
      });
  };

  return {
    getThreads,
    threadsExist,
    threadsLoading,
    threadsError,
  };
};

export default useGetThreads;
