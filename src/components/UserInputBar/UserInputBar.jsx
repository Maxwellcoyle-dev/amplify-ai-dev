import { useState, useContext } from "react";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../../state/AppContext";

// Ant D Icons
import { SendOutlined } from "@ant-design/icons";

// Custom Components
import TextEntry from "../TextEntry/TextEntry";

// Custom Hooks
import useLLMStream from "../../hooks/useLLMStream";
import useLLMDocQA from "../../hooks/useLLMDocQA";

// Ant UI
import { Button, Spin, Typography } from "antd";

// Styles
import styles from "./UserInputBar.module.css";

const UserInputBar = () => {
  const [value, setValue] = useState("");

  // const { fetchChat, chatLoading } = useOpenAIChat();
  const { fetchChatStream, streamLoading } = useLLMStream();
  const { fetchChatDocQA } = useLLMDocQA();

  const state = useContext(AppStateContext);
  const mode = state.threadData?.currentThread?.threadMode;

  const handleSubmit = async () => {
    console.log(state);
    console.log(mode);
    if (mode === "Doc QA Chat") {
      await fetchChatDocQA(value);
      setValue("");
    } else if (mode === "Standard Chat") {
      await fetchChatStream(value);
      setValue("");
    }
  };

  return (
    mode !== "" && (
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
    )
  );
};

export default UserInputBar;
