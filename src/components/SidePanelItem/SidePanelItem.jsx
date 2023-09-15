import React from "react";
import { BsChatRightText } from "react-icons/bs";

// Custom Components
import Text from "../Text/Text";

// Styles
import styles from "./SidePanelItem.module.css";

const SidePanelItem = ({ title }) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <BsChatRightText />
        <Text text={title} />
      </div>
    </div>
  );
};

export default SidePanelItem;
