import React, { useRef, useEffect, useState, useContext } from "react";

// Custom components
import ChatMessage from "../ChatMessage/ChatMessage";

// State Management
import { AppStateContext } from "../../state/AppContext";

// Hooks
import useGetThread from "../../hooks/useGetThread";

// Styles
import styles from "./ChatContainer.module.css";
import { Button, Space, Spin, Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ChatContainer = ({
  setShowTopBar,
  showTopBar,
  setShowNewThreadModal,
}) => {
  const [updateThread, setUpdateThread] = useState(false);

  // Get threadLoading and threadError from useGetThread hook
  const { threadLoading } = useGetThread();

  // Get ThreadData State then destructure currentThread
  const state = useContext(AppStateContext);
  const currentThread = state?.threadData?.currentThread;
  const mode = currentThread?.threadMode;

  // Handle auto scrolling when new message is added
  // Add ref to last message
  const lastMessageRef = useRef(null);

  // useEffect to scroll to last message
  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentThread]);

  const containerRef = useRef(null);
  let lastScrollTop = 0;

  useEffect(() => {
    if (!containerRef.current) return;
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

  const handleNewThread = () => {
    setShowNewThreadModal(true);
  };

  return (
    <Flex
      vertical
      gap="middle"
      className={`${styles.container} ${
        showTopBar ? "" : styles["topBar-hidden"]
      }`}
      ref={containerRef}
    >
      {threadLoading ? (
        <Space style={{ height: "100vh" }}>
          <Spin />
        </Space>
      ) : mode === "" ? (
        <Flex
          style={{ width: "100%", height: "100vh" }}
          justify="center"
          align="center"
          gap="middle"
        >
          <Button icon={<PlusOutlined />} onClick={handleNewThread}>
            New Thread
          </Button>
          <Typography.Title level={4} strong>
            /
          </Typography.Title>
          <Typography.Text>
            Choose a previous Thread to work with.
          </Typography.Text>
        </Flex>
      ) : !currentThread.messages ? (
        <Flex
          style={{ width: "100%", height: "100vh" }}
          justify="center"
          align="center"
          gap="middle"
        >
          <Typography.Text>
            Write a message to start the thread.
          </Typography.Text>
        </Flex>
      ) : (
        currentThread.messages &&
        currentThread?.messages?.map((message, i) => (
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
    </Flex>
  );
};

export default ChatContainer;
