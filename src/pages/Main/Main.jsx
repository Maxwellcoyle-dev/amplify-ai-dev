import React from "react";

// Styles
import styles from "./Main.module.css";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";
import TopBar from "../../components/TopBar/TopBar";

const Main = ({ setShowTopBar, showTopBar }) => {
  return (
    <div className={styles.container}>
      <TopBar showTopBar={showTopBar} />
      <ThreadAttachmentsModal />
      <ChatContainer setShowTopBar={setShowTopBar} showTopBar={showTopBar} />
      <UserInputBar />
    </div>
  );
};

export default Main;
