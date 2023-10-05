import React, { useContext, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

// State Management
import { AppDispatchContext, AppStateContext } from "../../state/AppContext";
import {
  RESET_CURRENT_THREAD,
  SET_CURRENT_THREAD_ID,
} from "../../state/actions/actionTypes";

// Hooks
import useGetThreads from "../../hooks/useGetThreads";
import useGetThread from "../../hooks/useGetThread";

// Ant UI
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Menu, Space, Spin } from "antd";

import styles from "./SidePanel.module.css";

// Components
import SidePanelHeader from "../../components/SidePanelHeader/SidePanelHeader";

const newThreadUUID = uuidv4();

const SidePanel = ({ collapsed }) => {
  const dispatch = useContext(AppDispatchContext);
  const { threadData } = useContext(AppStateContext);

  // current threadID
  const currentThreadID = threadData?.currentThread?.threadID;

  const { getThreads, threadsLoading } = useGetThreads(); // Custom hook for getting all threads
  const { getThread } = useGetThread(); // Custom hook for getting a single thread

  // Get all threads from the database on component mount
  useEffect(() => {
    getThreads();
  }, []);

  const createNewThread = () => {
    dispatch({ type: RESET_CURRENT_THREAD });
  };

  const openThread = (threadID) => {
    getThread(threadID); // Get the thread from the database
    dispatch({ type: SET_CURRENT_THREAD_ID, payload: threadID });
  };

  return (
    <Space direction="vertical" className={styles.container}>
      <SidePanelHeader collapsed={collapsed} />

      <Menu
        defaultSelectedKeys={[newThreadUUID]}
        mode="vertical"
        selectedKeys={currentThreadID ? currentThreadID : newThreadUUID}
        className={styles.menu}
      >
        <Menu.Item
          key={newThreadUUID}
          icon={<PlusOutlined />}
          onClick={createNewThread}
        >
          New Thread
        </Menu.Item>
        {/* Map through the threads and create Menu items for each */}
        {!threadsLoading ? (
          threadData?.threads?.map((thread) => (
            <Menu.Item
              key={thread.threadID}
              icon={<RightOutlined />}
              onClick={() => openThread(thread.threadID)}
            >
              {thread.threadTitle}
            </Menu.Item>
          ))
        ) : (
          <Space className={styles.spinDiv}>
            <Spin size="large" />
          </Space>
        )}
      </Menu>
    </Space>
  );
};

export default SidePanel;
