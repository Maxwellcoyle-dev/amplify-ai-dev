import React, { useState, useContext, useEffect } from "react";

// State management
import { AppStateContext, AppDispatchContext } from "../../state/AppContext";

// Custom Hooks
import useSetThreadTitle from "../../hooks/useSetThreadTitle";

// Custom Components
import Text from "../Text/Text";

// ANT Design Imports
import { Input, Button, Space } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

// Styles
import styles from "./TopBarTitle.module.css";

const TopBarTitle = () => {
  // threadData from State
  const { threadData } = useContext(AppStateContext);
  const currentThreadTitle = threadData?.currentThread?.threadTitle;
  const currentThreadID = threadData?.currentThread?.threadID;

  // State value to determine if title is being edited
  const [editTitle, setEditTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  useEffect(() => {
    setTitleValue(currentThreadTitle);
  }, [currentThreadTitle]);

  //   SetTitle from useSetThreadTitle
  const { setTitle } = useSetThreadTitle();

  //   Dispatch
  const dispatch = useContext(AppDispatchContext);

  const handleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const handleSetTitle = () => {
    dispatch({
      type: "SET_THREAD_TITLE",
      payload: {
        threadTitle: titleValue,
        threadID: currentThreadID,
      },
    });
    setTitle(currentThreadID, titleValue);
    setEditTitle(false);
  };

  return (
    <Space className={styles.container}>
      {editTitle ? (
        <Space>
          <Input
            placeholder="My New Thread"
            value={titleValue}
            onChange={handleChange}
            onPressEnter={handleSetTitle}
          />
          <CloseOutlined onClick={() => setEditTitle(false)} />
        </Space>
      ) : currentThreadTitle ? (
        <Space>
          <Text text={currentThreadTitle} styleType="topBarTitle" />
          <EditOutlined onClick={() => setEditTitle(true)} />
        </Space>
      ) : (
        <Button onClick={() => setEditTitle(true)}>Add Title</Button>
      )}
    </Space>
  );
};

export default TopBarTitle;
