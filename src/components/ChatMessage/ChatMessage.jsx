import React, { forwardRef, useState, useContext } from "react";

// Styles
import styles from "./ChatMessage.module.css";

// Components
import ChatText from "../ChatText/ChatText";

// Hooks
import usePushCurrentThread from "../../hooks/usePushCurrentThread";

// State management
import { AppDispatchContext } from "../../state/AppContext";
import { DELETE_MESSAGE, EDIT_MESSAGE } from "../../state/actions/actionTypes";

// Ant Design
import { Typography, Space, Button } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CloseOutlined,
  EditOutlined,
  CheckOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ChatMessage = forwardRef(
  ({ persona, message, messageID, updateThread, setUpdateThread }, ref) => {
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

    return (
      <div className={styles.container} ref={ref}>
        <div className={styles.headerContainer}>
          <Space>
            {persona === "user" ? <UserOutlined /> : <RobotOutlined />}
            <Text type="secondary">{persona}</Text>
          </Space>
          <Space>
            <Button
              type="text"
              onClick={isEditable ? handleEditMessage : handleEditToggle}
            >
              {!isEditable ? <EditOutlined /> : <CheckOutlined />}
            </Button>
            <Button type="text">
              <CopyOutlined />
            </Button>
            <Button danger type="text" onClick={handleDeleteMessage}>
              <CloseOutlined />
            </Button>
          </Space>
        </div>

        <div
          className={
            isEditable
              ? styles.textContainerEditable
              : styles.textContainerReadOnly
          }
        >
          <ChatText
            isEditable={isEditable}
            text={message}
            setEditorContent={setEditorContent}
          ></ChatText>
        </div>
      </div>
    );
  }
);

export default ChatMessage;
