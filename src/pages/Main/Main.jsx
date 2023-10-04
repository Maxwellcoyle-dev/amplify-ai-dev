import React from "react";

// Styles
import styles from "./Main.module.css";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";

const Main = () => {
  return (
    <div className={styles.container}>
      <ThreadAttachmentsModal />
      <ChatContainer />
      <UserInputBar />
    </div>
  );
};

export default Main;
