import React, { useContext } from "react";

// Ant Design
import { Input } from "antd";

// State Management
import { AppStateContext } from "../../state/AppContext";

const { TextArea } = Input;

const TextEntry = ({ value, setValue, handleSubmit }) => {
  const state = useContext(AppStateContext);
  const mode = state.threadData?.currentThread?.threadMode;

  return (
    <TextArea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={mode === "" ? true : false}
      placeholder="Write some instructions here..."
      type="textarea"
      size="large"
      styles={{ padding: "1rem" }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          handleSubmit();
          e.preventDefault();
        }
      }}
      autoSize={{
        minRows: 1,
        maxRows: 6,
      }}
    />
  );
};

export default TextEntry;
