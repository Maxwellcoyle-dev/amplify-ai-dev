import React from "react";

// Custom Components
import TopBarDropdown from "../TopBarDropdown/TopBarDropdown";
import TopBarTitle from "../TopBarTitle/TopBarTitle";
import TopBarMenu from "../TopBarMenu/TopBarMenu";

// Ant UI
import { Space } from "antd";

// Custom styles
import styles from "./TopBar.module.css";

const TopBar = ({ setShowAttachmentModal }) => {
  return (
    <>
      <TopBarTitle />
      <TopBarDropdown />
      <TopBarMenu setShowAttachmentModal={setShowAttachmentModal} />
    </>
  );
};

export default TopBar;
