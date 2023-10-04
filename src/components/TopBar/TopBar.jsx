import React from "react";

// Custom Components
import TopBarTitle from "../TopBarTitle/TopBarTitle";
import TopBarMenu from "../TopBarMenu/TopBarMenu";

// Ant Design
import { Typography } from "antd";

const TopBar = () => {
  return (
    <>
      <TopBarTitle />
      <Typography.Title level={5}>GPT-4</Typography.Title>
      <TopBarMenu />
    </>
  );
};

export default TopBar;
