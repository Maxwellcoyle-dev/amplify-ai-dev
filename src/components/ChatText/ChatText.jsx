import React from "react";

// Ant Design
import { Typography } from "antd";

const ChatText = ({ text }) => {
  return (
    <div>
      <Typography.Text>{text}</Typography.Text>
    </div>
  );
};

export default ChatText;
