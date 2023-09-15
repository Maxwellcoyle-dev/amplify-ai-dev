import React, { useContext } from "react";

// Ant UI
import { Layout } from "antd";

// Styles
import styles from "./Main.module.css";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";

// State Management
import { AppStateContext } from "../../state/AppContext";

const Main = ({ showAttachmentModal, setShowAttachmentModal }) => {
  const { threadData } = useContext(AppStateContext);

  return (
    <>
      <div className={styles.container}>
        <ThreadAttachmentsModal
          showAttachmentModal={showAttachmentModal}
          setShowAttachmentModal={setShowAttachmentModal}
        />
        <ChatContainer currentThread={threadData.currentThread} />
        <UserInputBar />
      </div>
    </>
  );
};

export default Main;
