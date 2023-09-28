import { useState } from "react";

// Ant D Icons
import { SendOutlined } from "@ant-design/icons";

// Custom Components
import TextEntry from "../TextEntry/TextEntry";

// Custom Hooks
import useOpenAIChat from "../../hooks/useOpenAIChat";

// Ant UI
import { Button, Spin } from "antd";

// Styles
import styles from "./UserInputBar.module.css";

const UserInputBar = () => {
  const [value, setValue] = useState("");

  const { fetchChat, chatLoading } = useOpenAIChat();

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
      {chatLoading ? (
        <Spin className={styles.loading} size="large" />
      ) : (
        <Button
          type="default"
          icon={<SendOutlined />}
          size="large"
          onClick={handleSubmit}
        />
      )}
    </div>
  );
};

export default UserInputBar;
