import React, { useContext } from "react";

// Custom Components
import TopBarDelete from "../TopBarDelete/TopBarDelete";
import TopBarFilesBtn from "../TopBarFilesBtn/TopBarFilesBtn";

// Context & Actions
import { AppStateContext } from "../../state/AppContext";

// Ant Design
import { Space } from "antd";

const TopBarMenu = () => {
  const state = useContext(AppStateContext);
  const mode = state.threadData.currentThread?.threadMode;
  return (
    <Space>
      {mode === "Doc QA Chat" && <TopBarFilesBtn />}
      <TopBarDelete />
    </Space>
  );
};

export default TopBarMenu;
