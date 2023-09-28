import { useContext } from "react";

// State management
import { AppDispatchContext } from "../state/AppContext";
import { RESET_CURRENT_THREAD } from "../state/actions/actionTypes";

// Custom Hooks
import useGetThreads from "./useGetThreads";

// Amplify API
import { API, Auth } from "aws-amplify";

const useDeleteThread = () => {
  const dispatch = useContext(AppDispatchContext);
  const { getThreads } = useGetThreads();

  const myAPI = `trainicityAiAPI`;
  const path = `/deleteThread`;

  const deleteThread = async (threadId) => {
    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const userID = user.attributes.email; // Get the current user's email for userID
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!token) return console.log("No token"); // Check for a token

    const init = {
      body: JSON.stringify({
        threadID: threadId,
        userID: userID,
      }),

      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    API.post(myAPI, path, init)
      .then((response) => {
        console.log(response);
        dispatch({ type: RESET_CURRENT_THREAD });
      })
      .catch((error) => console.log(error))
      .finally(() => getThreads());
  };

  return { deleteThread };
};

export default useDeleteThread;
