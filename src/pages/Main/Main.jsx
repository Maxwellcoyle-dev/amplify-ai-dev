import React, { useEffect, useContext } from "react";

// Styles
import styles from "./Main.module.css";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";
import TopBar from "../../components/TopBar/TopBar";
import NewThreadModal from "../../components/NewThreadModal/NewThreadModal";

// Ant Design
import { Flex } from "antd";

const Main = ({
  setShowTopBar,
  showTopBar,
  setShowNewThreadModal,
  showNewThreadModal,
}) => {
  return (
    <Flex className={styles.container} vertical>
      <TopBar showTopBar={showTopBar} />
      <ThreadAttachmentsModal />
      <ChatContainer
        setShowTopBar={setShowTopBar}
        showTopBar={showTopBar}
        setShowNewThreadModal={setShowNewThreadModal}
      />
      <NewThreadModal
        setShowNewThreadModal={setShowNewThreadModal}
        showNewThreadModal={showNewThreadModal}
      />

      <UserInputBar />
    </Flex>
  );
};

export default Main;
