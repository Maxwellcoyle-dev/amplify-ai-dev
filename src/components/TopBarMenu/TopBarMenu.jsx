import React from "react";

// Custom Components
import TopBarDelete from "../TopBarDelete/TopBarDelete";
import TopBarFilesBtn from "../TopBarFilesBtn/TopBarFilesBtn";

// Ant Design
import { Space } from "antd";

const TopBarMenu = ({ setShowAttachmentModal }) => {
  return (
    <Space>
      <TopBarFilesBtn setShowAttachmentModal={setShowAttachmentModal} />
      <TopBarDelete />
    </Space>
  );
};

export default TopBarMenu;
