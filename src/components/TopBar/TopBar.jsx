import React, { useContext } from "react";

// Custom Components
import TopBarTitle from "../TopBarTitle/TopBarTitle";
import TopBarMenu from "../TopBarMenu/TopBarMenu";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../../state/AppContext";

// Ant Design
import { Typography, Space } from "antd";

import styles from "./TopBar.module.css";

const TopBar = ({ showTopBar }) => {
  const state = useContext(AppStateContext);
  const mode = state.mode?.mode;
  return (
    <Space
      className={`${styles.topBar} ${
        showTopBar ? "" : styles["topBar-hidden"]
      }`}
    >
      <TopBarTitle />
      <Typography.Title level={5}>{mode || ""}</Typography.Title>
      <TopBarMenu />
    </Space>
  );
};

export default TopBar;
