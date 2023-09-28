import { useContext, useState } from "react";

// Amplify API
import { Auth } from "aws-amplify";

// Context & Actions
import { AppDispatchContext } from "../state/AppContext";
import { SET_USER } from "../state/actions/actionTypes";

const useGetUser = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  const dispatch = useContext(AppDispatchContext);

  const getUser = async () => {
    setUserLoading(true);
    setUserError(null);
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;

    if (!user) return console.log("No user");
    if (!token) {
      console.log("No token");
      return;
    }

    if (user && token) {
      dispatch({
        type: SET_USER,
        payload: { userID: user.attributes.email, token: token },
      });
      setUserLoading(false);
    } else {
      setUserLoading(false);
      setUserError("Error getting user");
    }
  };

  return { getUser, userLoading, userError };
};

export default useGetUser;
