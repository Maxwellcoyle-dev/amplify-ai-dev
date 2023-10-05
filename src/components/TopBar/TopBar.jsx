import React from "react";

// Custom Components
import TopBarTitle from "../TopBarTitle/TopBarTitle";
import TopBarMenu from "../TopBarMenu/TopBarMenu";

// Ant Design
import { Typography, Space } from "antd";

import styles from "./TopBar.module.css";

const TopBar = ({ showTopBar }) => {
  return (
    <Space
      className={`${styles.topBar} ${
        showTopBar ? "" : styles["topBar-hidden"]
      }`}
    >
      <TopBarTitle />
      <Typography.Title level={5}>GPT-4</Typography.Title>
      <TopBarMenu />
    </Space>
  );
};

export default TopBar;
