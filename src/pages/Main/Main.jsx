import React, { useContext } from "react";

// Styles
import styles from "./Main.module.css";

// Custom Hooks
import useOpenAIChat from "../../hooks/useOpenAIChat";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";

// State Management
import { AppStateContext } from "../../state/AppContext";

const Main = ({ showAttachmentModal, setShowAttachmentModal }) => {
  const { threadData } = useContext(AppStateContext);

  const { chatError } = useOpenAIChat();

  return (
    <>
      <div className={styles.container}>
        <ThreadAttachmentsModal
          showAttachmentModal={showAttachmentModal}
          setShowAttachmentModal={setShowAttachmentModal}
        />
        <ChatContainer currentThread={threadData.currentThread} />
        {chatError && <div>Error</div>}
        <UserInputBar />
      </div>
    </>
  );
};

export default Main;
