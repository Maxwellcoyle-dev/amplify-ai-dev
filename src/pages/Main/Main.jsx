import React, { useContext, useEffect, useState } from "react";

// Styles
import styles from "./Main.module.css";

// Custom Hooks
// import useOpenAIChat from "../../hooks/useOpenAIChat";
import useLLMStream from "../../hooks/useLLMStream";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";

// State Management
import { AppStateContext } from "../../state/AppContext";
import { StreamedResponseProvider } from "../../state/StreamedResponseContext";

const Main = ({ showAttachmentModal, setShowAttachmentModal }) => {
  const { threadData } = useContext(AppStateContext);

  return (
    <StreamedResponseProvider>
      <div className={styles.container}>
        <ThreadAttachmentsModal
          showAttachmentModal={showAttachmentModal}
          setShowAttachmentModal={setShowAttachmentModal}
        />
        <ChatContainer currentThread={threadData.currentThread} />
        <UserInputBar />
      </div>
    </StreamedResponseProvider>
  );
};

export default Main;
