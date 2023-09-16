import React, { useState } from "react";

// Ant D Icons
import { SendOutlined } from "@ant-design/icons";

// Custom Components
import TextEntry from "../TextEntry/TextEntry";

// Custom Hooks
import useOpenAIChat from "../../hooks/useOpenAIChat";
import usePushCurrentThread from "../../hooks/usePushCurrentThread";

// Ant UI
import { Button } from "antd";

// Styles
import styles from "./UserInputBar.module.css";

const UserInputBar = () => {
  const [value, setValue] = useState("");

  const { fetchChat, newMessageAdded, setNewMessageAdded } = useOpenAIChat();

  // Pass newMessageAdded to usePushCurrentThread
  usePushCurrentThread(newMessageAdded, setNewMessageAdded);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchChat(value);
    setValue("");
  };

  return (
    <div className={styles.container}>
      <TextEntry
        value={value}
        setValue={setValue}
        handleSubmit={handleSubmit}
      />
      <Button
        type="default"
        icon={<SendOutlined />}
        size="large"
        onClick={handleSubmit}
      />
    </div>
  );
};

export default UserInputBar;
