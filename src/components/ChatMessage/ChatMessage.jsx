import React, { forwardRef, useState, useContext } from "react";

// Styles
import styles from "./ChatMessage.module.css";

import Markdown from "react-markdown";
import gfm from "remark-gfm";

// Hooks
import usePushCurrentThread from "../../hooks/usePushCurrentThread";

// State management
import { AppDispatchContext } from "../../state/AppContext";
import { DELETE_MESSAGE, EDIT_MESSAGE } from "../../state/actions/actionTypes";

// Ant Design
import { Typography, Space, Button, message } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ChatMessage = forwardRef(({ persona, chatMessage, messageID }, ref) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const dispatch = useContext(AppDispatchContext);

  const { setUpdateCurrentThread } = usePushCurrentThread();

  const handleEditToggle = () => {
    setIsEditable((prev) => !prev);
  };

  const handleDeleteMessage = (event) => {
    event.preventDefault();
    dispatch({ type: DELETE_MESSAGE, payload: messageID });

    setUpdateCurrentThread(true);
  };

  const handleEditMessage = (event) => {
    event.preventDefault();
    setIsEditable((prev) => !prev);
    if (editorContent) {
      console.log("Editing message");
      dispatch({
        type: EDIT_MESSAGE,
        payload: { messageID, content: editorContent },
      });
      setUpdateCurrentThread(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(chatMessage);
    message.open({
      type: "success",
      content: "Copied to clipboard!",
      duration: 1,
    });
  };

  return (
    <Space ref={ref} direction="vertical" className={styles.chatMessageWrapper}>
      <Space className={styles.container}>
        <Space className={styles.personaSpace}>
          {persona === "user" ? <UserOutlined /> : <RobotOutlined />}
          <Text type="secondary">{persona}</Text>
        </Space>
        <Space className={styles.optionsSpace}>
          <Button
            type="text"
            onClick={isEditable ? handleEditMessage : handleEditToggle}
          >
            {!isEditable ? <EditOutlined /> : <CheckOutlined />}
          </Button>
          <Button type="text" onClick={handleCopy}>
            <CopyOutlined />
          </Button>
          <Button danger type="text" onClick={handleDeleteMessage}>
            <CloseOutlined />
          </Button>
        </Space>
      </Space>

      <Space className={styles.chatTextContainer}>
        <Markdown children={chatMessage} remarkPlugins={[gfm]} />
      </Space>
    </Space>
  );
});

export default ChatMessage;
