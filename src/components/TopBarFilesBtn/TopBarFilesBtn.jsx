import React, { useContext } from "react";

// State management
import { AppStateContext } from "../../state/AppContext";

// Ant Design
import { Button } from "antd";

const TopBarFilesBtn = ({ setShowAttachmentModal }) => {
  const { threadData } = useContext(AppStateContext);
  const currentThreadFiles = threadData?.currentThread?.files;

  const handleClick = (event) => {
    event.preventDefault();

    setShowAttachmentModal(true);
  };

  return (
    <Button type="primary" ghost onClick={handleClick}>
      Thread Attachments
    </Button>
  );
};

export default TopBarFilesBtn;
