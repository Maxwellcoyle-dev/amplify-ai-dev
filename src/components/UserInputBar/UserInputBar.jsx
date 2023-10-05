import { useState } from "react";

// Ant D Icons
import { SendOutlined } from "@ant-design/icons";

// Custom Components
import TextEntry from "../TextEntry/TextEntry";

// Custom Hooks
import useLLMStream from "../../hooks/useLLMStream";

// Ant UI
import { Button, Space, Spin, Typography } from "antd";

// Styles
import styles from "./UserInputBar.module.css";

const UserInputBar = () => {
  const [value, setValue] = useState("");

  // const { fetchChat, chatLoading } = useOpenAIChat();
  const { fetchChatStream, streamLoading } = useLLMStream();

  const handleSubmit = async () => {
    await fetchChatStream(value);
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
      {streamLoading ? (
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
