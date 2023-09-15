import React, { useContext } from "react";

// State management
import { AppStateContext } from "../../state/AppContext";

// Custom Hooks
import useDeleteThread from "../../hooks/useDeleteThread";

// ANT Design Imports
import { Button } from "antd";

const TopBarDelete = () => {
  const { threadData } = useContext(AppStateContext);
  const currentThreadID = threadData?.currentThread?.threadID;

  const { deleteThread } = useDeleteThread();

  const handleDelete = (event) => {
    event.preventDefault();
    deleteThread(currentThreadID);
  };

  return currentThreadID ? (
    <Button onClick={handleDelete} danger type="text">
      Delete Thread
    </Button>
  ) : (
    <Button onClick={handleDelete} danger type="text" disabled>
      Delete Thread
    </Button>
  );
};

export default TopBarDelete;
