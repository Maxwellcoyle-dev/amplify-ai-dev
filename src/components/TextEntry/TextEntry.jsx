import React, { useState } from "react";

// Ant Design
import { Input } from "antd";

const { TextArea } = Input;

const TextEntry = ({ value, setValue, handleSubmit }) => {
  return (
    <TextArea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Write some instructions here..."
      type="textarea"
      size="large"
      styles={{ padding: "1rem" }}
      onPressEnter={handleSubmit}
      autoSize={{
        minRows: 1,
        maxRows: 6,
      }}
    />
  );
};

export default TextEntry;
