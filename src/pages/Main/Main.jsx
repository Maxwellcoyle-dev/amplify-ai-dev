import React, { useContext } from "react";

// Styles
import styles from "./Main.module.css";

// Custom Components
import UserInputBar from "../../components/UserInputBar/UserInputBar";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import ThreadAttachmentsModal from "../../components/ThreadAttachmentsModal/ThreadAttachmentsModal";
import TopBar from "../../components/TopBar/TopBar";
import NewThreadModal from "../../components/NewThreadModal/NewThreadModal";

const Main = ({
  setShowTopBar,
  showTopBar,
  setShowNewThreadModal,
  showNewThreadModal,
}) => {
  return (
    <div className={styles.container}>
      <TopBar showTopBar={showTopBar} />
      <ThreadAttachmentsModal />
      <ChatContainer setShowTopBar={setShowTopBar} showTopBar={showTopBar} />
      <NewThreadModal
        setShowNewThreadModal={setShowNewThreadModal}
        showNewThreadModal={showNewThreadModal}
      />

      <UserInputBar />
    </div>
  );
};

export default Main;
