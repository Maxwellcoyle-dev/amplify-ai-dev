// provider component to use the reducer and provide its state and dispatch function to child components
import React, { useReducer } from "react";

// Contexts for state and dispatch
import { AppStateContext, AppDispatchContext } from "./AppContext";

// Root Reducer
import rootReducer from "./reducers/rootReducer";

// Initial States for reducers
import { initialState as threadInitialState } from "./reducers/threadReducer";
import { initialState as userInitialState } from "./reducers/userReducer";

// INitial State for AppProvider
const initialState = {
  user: userInitialState,
  threadData: threadInitialState,
  currentMode: "default",
  showAttachmentModal: false,
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
