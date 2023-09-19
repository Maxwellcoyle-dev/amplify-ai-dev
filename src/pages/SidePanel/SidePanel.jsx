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
import { Menu } from "antd";

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

  useEffect(() => {
    getThreads(); // Get all threads from the database
  }, []);

  const createNewThread = () => {
    dispatch({ type: RESET_CURRENT_THREAD });
  };

  const openThread = (threadID) => {
    getThread(threadID); // Get the thread from the database
    dispatch({ type: SET_CURRENT_THREAD_ID, payload: threadID });
  };

  return (
    <>
      <div className="demo-logo-vertical" />
      <SidePanelHeader collapsed={collapsed} />

      <Menu
        defaultSelectedKeys={[newThreadUUID]}
        mode="vertical"
        selectedKeys={currentThreadID ? currentThreadID : newThreadUUID}
      >
        <Menu.Item
          key={newThreadUUID}
          icon={<PlusOutlined />}
          onClick={createNewThread}
        >
          New Thread
        </Menu.Item>
        {/* Map through the threads and create Menu items for each */}
        {threadData?.threads?.map((thread) => (
          <Menu.Item
            key={thread.threadID}
            icon={<RightOutlined />}
            onClick={() => openThread(thread.threadID)}
          >
            {thread.threadTitle}
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export default SidePanel;
