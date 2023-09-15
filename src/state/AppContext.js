// create a context for the app state and a separate one for the dispatcher function
import React from "react";

const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

export { AppStateContext, AppDispatchContext };
