import { useContext, useEffect } from "react";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../state/AppContext";
import { GET_CURRENT_THREAD } from "../state/actions/actionTypes";

// Amplify API
import { API, Auth } from "aws-amplify";

const useGetThread = () => {
  const dispatch = useContext(AppDispatchContext);

  const myAPI = `threadapi`;
  const path = `/getThread`;

  const getThread = async (threadID) => {
    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const userID = user.attributes.email; // Get the current user's email for userID
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!token) return console.log("No token"); // Check for a token
    if (!threadID) return console.log("No threadID"); // Check for a threadID

    const init = {
      body: JSON.stringify({
        threadID: threadID,
        userID: userID,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    API.post(myAPI, path, init)
      .then((response) => {
        dispatch({ type: GET_CURRENT_THREAD, payload: response });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return { getThread };
};

export default useGetThread;
