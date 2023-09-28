import React from "react";

// Ant Design
import { Button } from "antd";

const TopBarFilesBtn = ({ setShowAttachmentModal }) => {
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
