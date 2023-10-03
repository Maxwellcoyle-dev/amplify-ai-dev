import { createContext, useContext, useState } from "react";

const StreamedResponseContext = createContext();

export const useStreamedResponse = () => {
  return useContext(StreamedResponseContext);
};

export const StreamedResponseProvider = ({ children }) => {
  const [streamedResponse, setStreamedResponse] = useState({
    loading: false,
    error: false,
    message: "",
    done: false,
  });

  const value = {
    streamedResponse,
    setStreamedResponse,
  };

  return (
    <StreamedResponseContext.Provider value={value}>
      {children}
    </StreamedResponseContext.Provider>
  );
};
