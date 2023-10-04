import React, { useRef, useEffect, useState, useContext } from "react";

// Custom components
import ChatMessage from "../ChatMessage/ChatMessage";

// State Management
import { AppStateContext } from "../../state/AppContext";

// Styles
import styles from "./ChatContainer.module.css";

const ChatContainer = () => {
  const [updateThread, setUpdateThread] = useState(false);

  // Get ThreadData State then destructure currentThread
  const { threadData } = useContext(AppStateContext);
  const currentThread = threadData.currentThread;

  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentThread, threadData]);

  return (
    <div className={styles.container}>
      {currentThread.messages &&
        currentThread.messages.map((message, i) => (
          <ChatMessage
            key={message.messageID}
            persona={message.role}
            chatMessage={message.content}
            messageID={message.messageID}
            updateThread={updateThread}
            setUpdateThread={setUpdateThread}
            ref={
              i === currentThread.messages.length - 1 ? lastMessageRef : null
            }
          />
        ))}
    </div>
  );
};

export default ChatContainer;
