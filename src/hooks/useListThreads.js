import { useContext } from "react";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../state/AppContext";
import { SET_THREADS } from "../state/actions/actionTypes";

// Amplify API
import { API, Auth } from "aws-amplify";

const myAPI = `trainicityAiAPI`;
const path = `/getThreadsList`;

const useListThreads = () => {
  const dispatch = useContext(AppDispatchContext);

  const getThreads = async () => {
    const user = await Auth.currentAuthenticatedUser();
    if (!user) return console.log("No user"); // Check for an Authenticated User

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
        const mappedResponse = response.map((item) => {
          return {
            userID: item.UserID.S,
            threadID: item.ThreadID.S,
            threadTitle: item.ThreadTitle?.S,
            lastUpdated: item.LastUpdated?.S,
          };
        });

        dispatch({ type: SET_THREADS, payload: mappedResponse });
      })
      .catch((error) => console.log(error));
  };

  return {
    getThreads,
  };
};

export default useListThreads;
