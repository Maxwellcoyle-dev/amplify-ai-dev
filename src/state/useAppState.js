import { useContext } from "react";
import { AppStateContext } from "./AppContext";

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};

export default useAppState;
