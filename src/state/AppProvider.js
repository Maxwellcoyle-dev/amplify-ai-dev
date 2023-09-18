// provider component to use the reducer and provide its state and dispatch function to child components
import React, { useReducer } from "react";
import { AppStateContext, AppDispatchContext } from "./AppContext";
import rootReducer from "./reducers/rootReducer";

import { initialState as threadInitialState } from "./reducers/threadReducer";
import { initialState as userInitialState } from "./reducers/userReducer";

const initialState = {
  user: userInitialState,
  threadData: threadInitialState,
  files: [],
  threadFiles: {},
  currentMode: "default",
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export default AppProvider;
