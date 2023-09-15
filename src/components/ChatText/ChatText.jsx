import React, { useState, useRef, useEffect } from "react";

// Draft.js
import { Editor, EditorState, ContentState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";

// Ant Design
import { Button, Space } from "antd";
import { UnorderedListOutlined, OrderedListOutlined } from "@ant-design/icons";

// styles
import styles from "./ChatText.module.css";

const ChatText = ({ text, isEditable, setEditorContent }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(text))
  );

  const editor = useRef(null);

  useEffect(() => {
    setEditorContent(() => editorState.getCurrentContent().getPlainText());
  }, [editorState]);

  useEffect(() => {
    if (isEditable) {
      editor.current.focus();
    }
  }, [isEditable]);

  const handleBoldClick = () => {
    toggleInlineStyle("BOLD");
  };

  const handleItalicClick = () => {
    toggleInlineStyle("ITALIC");
  };

  const handleULClick = () => {
    toggleBlockType("unordered-list-item");
  };

  const handleOLClick = () => {
    toggleBlockType("ordered-list-item");
  };

  // Common functions to simplify the toggle process
  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    setEditorState(newState);
  };

  const toggleBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    setEditorState(newState);
  };

  return (
    <div>
      {isEditable && (
        <Space className={styles.editorToolbar}>
          <Button onClick={handleBoldClick}>B</Button>
          <Button onClick={handleItalicClick}>I</Button>
          <Button onClick={handleULClick}>
            <UnorderedListOutlined />
          </Button>
          <Button onClick={handleOLClick}>
            <OrderedListOutlined />
          </Button>
        </Space>
      )}
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        readOnly={!isEditable}
        ref={editor}
      ></Editor>
    </div>
  );
};

export default ChatText;
