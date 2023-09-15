import { useContext } from "react";
import { AppDispatchContext } from "./AppContext";

const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within an AppProvider");
  }
  return context;
};

export default useAppDispatch;
