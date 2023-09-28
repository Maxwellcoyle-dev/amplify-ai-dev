import { useState } from "react";

// Ant D Icons
import { SendOutlined } from "@ant-design/icons";

// Custom Components
import TextEntry from "../TextEntry/TextEntry";

// Custom Hooks
import useOpenAIChat from "../../hooks/useOpenAIChat";

// Ant UI
import { Button, Space, Spin, Typography } from "antd";

// Styles
import styles from "./UserInputBar.module.css";

const UserInputBar = () => {
  const [value, setValue] = useState("");

  const { fetchChat, chatLoading } = useOpenAIChat();

  const handleSubmit = () => {
    fetchChat(value);
    setValue("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.TextEntryDiv}>
        <TextEntry
          value={value}
          setValue={setValue}
          handleSubmit={handleSubmit}
        />
        <Typography.Text type="secondary" className={styles.text}>
          Shift + Enter to add a new line
        </Typography.Text>
      </div>
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
