import React from "react";

// Custom Components
import TopBarDelete from "../TopBarDelete/TopBarDelete";
import TopBarFilesBtn from "../TopBarFilesBtn/TopBarFilesBtn";

// Ant Design
import { Space } from "antd";

const TopBarMenu = () => {
  return (
    <Space>
      <TopBarFilesBtn />
      <TopBarDelete />
    </Space>
  );
};

export default TopBarMenu;
