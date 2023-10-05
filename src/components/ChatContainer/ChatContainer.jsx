import React, { useRef, useEffect, useState, useContext } from "react";

// Custom components
import ChatMessage from "../ChatMessage/ChatMessage";

// State Management
import { AppStateContext } from "../../state/AppContext";

// Hooks
import useGetThread from "../../hooks/useGetThread";

// Styles
import styles from "./ChatContainer.module.css";
import { Space, Spin } from "antd";

const ChatContainer = ({ setShowTopBar, showTopBar }) => {
  const [updateThread, setUpdateThread] = useState(false);

  // Get threadLoading and threadError from useGetThread hook
  const { threadLoading } = useGetThread();

  // Get ThreadData State then destructure currentThread
  const { threadData } = useContext(AppStateContext);
  const currentThread = threadData.currentThread;

  // Handle auto scrolling when new message is added
  // Add ref to last message
  const lastMessageRef = useRef(null);

  // useEffect to scroll to last message
  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentThread, threadData]);

  const containerRef = useRef(null);
  let lastScrollTop = 0;

  useEffect(() => {
    const handleScroll = () => {
      let st = containerRef.current.scrollTop;
      const threshold = 5; // or whatever value works for you

      if (st > lastScrollTop + threshold) {
        // DownScrolling
        setShowTopBar(false);
      } else if (st < lastScrollTop - threshold) {
        // UpScrolling
        setShowTopBar(true);
      }
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    };

    const currentContainer = containerRef.current;
    currentContainer.addEventListener("scroll", handleScroll);

    return () => {
      currentContainer.removeEventListener("scroll", handleScroll);
    };
  }, [setShowTopBar]);

  useEffect(() => {
    console.log(threadLoading);
  }, [threadLoading]);

  return (
    <div
      className={`${styles.container} ${
        showTopBar ? "" : styles["topBar-hidden"]
      }`}
      ref={containerRef}
    >
      {threadLoading ? (
        <Space>
          <Spin />
        </Space>
      ) : (
        currentThread.messages &&
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
        ))
      )}
    </div>
  );
};

export default ChatContainer;
