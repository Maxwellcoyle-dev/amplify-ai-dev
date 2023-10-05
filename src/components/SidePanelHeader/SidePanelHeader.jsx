import React, { useEffect, useContext } from "react";

// AWS
import { Auth } from "aws-amplify";

// Hooks
import useGetUser from "../../hooks/useGetUser";

// State Management
import { AppStateContext } from "../../state/AppContext";

// Ant UI
import { LogoutOutlined } from "@ant-design/icons";
import { Typography, Space, Button } from "antd";

// Styles
import styles from "./SidePanelHeader.module.css";

const SidePanelHeader = ({ collapsed }) => {
  const { getUser } = useGetUser(); // Custom hook for getting a single user
  const { user } = useContext(AppStateContext);

  useEffect(() => {
    getUser(); // Get the user from the database
  }, []);

  const handleSignOutClick = async () => {
    try {
      await Auth.signOut();
      console.log("User signed out");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  return (
    <Space className={styles.container}>
      {!collapsed && (
        <Typography.Text className={styles.text}>
          {user?.userID?.split("@")[0]}
        </Typography.Text>
      )}
      <Button onClick={handleSignOutClick}>
        <LogoutOutlined />
      </Button>
    </Space>
  );
};

export default SidePanelHeader;
