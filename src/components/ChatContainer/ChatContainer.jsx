import React, { useRef, useEffect, useState, useContext } from "react";

// Custom components
import ChatMessage from "../ChatMessage/ChatMessage";

// State Management
import { AppStateContext } from "../../state/AppContext";

// Styles
import styles from "./ChatContainer.module.css";

const ChatContainer = ({ currentThread }) => {
  const [updateThread, setUpdateThread] = useState(false);

  const { threadData } = useContext(AppStateContext);

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
