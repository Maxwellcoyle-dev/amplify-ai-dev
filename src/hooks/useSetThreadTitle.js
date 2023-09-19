// Custom Hooks
import useGetThreads from "./useGetThreads";

// Amplify API
import { API, Auth } from "aws-amplify";

const useSetThreadTitle = () => {
  const { getThreads } = useGetThreads();

  const myAPI = `trainicityAiAPI`;
  const path = `/updateThreadTitle`;

  const setTitle = async (threadId, newTitle) => {
    const user = await Auth.currentAuthenticatedUser(); // Get the current user
    const userID = user.attributes.email; // Get the current user's email for userID
    const token = user.signInUserSession.idToken.jwtToken; // Get the current user's token for authorization

    if (!user) return console.log("No user"); // Check for an Authenticated User
    if (!token) return console.log("No token"); // Check for a token

    const init = {
      body: JSON.stringify({
        threadID: threadId,
        userID: userID,
        threadTitle: newTitle,
      }),

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

  return { setTitle };
};

export default useSetThreadTitle;
