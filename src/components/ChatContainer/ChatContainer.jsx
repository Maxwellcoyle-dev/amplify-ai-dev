import React, { useRef, useEffect, useState } from "react";

// Custom components
import ChatMessage from "../ChatMessage/ChatMessage";

// Styles
import styles from "./ChatContainer.module.css";

// Custom Hooks
import usePushCurrentThread from "../../hooks/usePushCurrentThread";

const ChatContainer = ({ currentThread }) => {
  const [updateThread, setUpdateThread] = useState(false);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentThread.messages]);

  return (
    <div className={styles.container}>
      {currentThread.messages &&
        currentThread.messages.map((message, i) => (
          <ChatMessage
            key={message.messageID}
            persona={message.role}
            message={message.content}
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
