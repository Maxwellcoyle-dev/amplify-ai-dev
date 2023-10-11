import React, { useContext } from "react";

// Styles
import styles from "./Main.module.css";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";
import TopBar from "../../components/TopBar/TopBar";

// Context & Actions
import { AppStateContext } from "../../state/AppContext";

// Custom Hooks
import useLLMDocSum from "../../hooks/useLLMDocSum";
import useLLMDocQA from "../../hooks/useLLMDocQA";
import { Button } from "antd";

const Main = ({ setShowTopBar, showTopBar }) => {
  const state = useContext(AppStateContext);
  const { fetchDocSum } = useLLMDocSum();
  const { fetchDocQA } = useLLMDocQA();

  return (
    <div className={styles.container}>
      <TopBar showTopBar={showTopBar} />
      <ThreadAttachmentsModal />
      <ChatContainer setShowTopBar={setShowTopBar} showTopBar={showTopBar} />
      <Button
        onClick={() => {
          fetchDocQA();
        }}
      >
        test function
      </Button>
      <UserInputBar />
    </div>
  );
};

export default Main;
