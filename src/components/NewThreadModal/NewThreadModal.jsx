import React, { useContext, useState } from "react";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../../state/AppContext";

// Hooks
import usePushCurrentThread from "../../hooks/usePushCurrentThread";

// Ant Design
import {
  Modal,
  Button,
  Row,
  Col,
  Typography,
  Card,
  Input,
  Space,
  Divider,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";
import AddFiles from "../AddFiles/AddFiles";

const { TextArea } = Input;

const NewThreadModal = ({ setShowNewThreadModal, showNewThreadModal }) => {
  const [newThreadMode, setNewThreadMode] = useState(""); // ["Standard Chat", "Doc QA Chat"
  const [newTitle, setNewTitle] = useState("");
  const [newThreadInstructions, setNewThreadInstructions] = useState("");

  const { setUpdateCurrentThread } = usePushCurrentThread();

  const dispatch = useContext(AppDispatchContext);
  const state = useContext(AppStateContext);
  const mode = state?.mode?.mode;

  const handleModeSelection = (mode) => {
    setNewThreadMode(mode);
  };

  const handleCancel = () => {
    dispatch({ type: "SET_MODE", payload: "" });
    setShowNewThreadModal(false);
  };

  const handleSetTitle = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSetInstructions = (e) => {
    setNewThreadInstructions(e.target.value);
  };

  const handleCreateStandardThread = () => {
    dispatch({
      type: "CREATE_NEW_THREAD",
      payload: {
        threadTitle: newTitle,
        threadMode: newThreadMode,
        threadInstructions: newThreadInstructions,
      },
    });
    setShowNewThreadModal(false);
    setUpdateCurrentThread(true);
  };

  const handleCreateDocQAThread = () => {
    dispatch({
      type: "CREATE_NEW_THREAD",
      payload: {
        threadTitle: newTitle,
        threadMode: newThreadMode,
        threadInstructions: newThreadInstructions,
      },
    });

    setShowNewThreadModal(false);
    setUpdateCurrentThread(true);
    dispatch({ type: "SHOW_ATTACHMENT_MODAL" });
  };

  const handleAfterClose = () => {
    setNewTitle("");
    setNewThreadMode("");
  };

  return (
    <Modal
      open={showNewThreadModal}
      onCancel={handleCancel}
      width="65%"
      keyboard
      afterClose={handleAfterClose}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Typography.Title level={3}>Pick a Mode</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          {/* STANDARD CHAT CARD */}
          <Card>
            <Typography.Title
              type={
                mode === "Standard Chat" || mode === ""
                  ? "default"
                  : "secondary"
              }
              level={4}
            >
              Standard AI Chat
            </Typography.Title>
            <Typography.Paragraph
              type={
                newThreadMode === "Standard Chat" || newThreadMode === ""
                  ? "default"
                  : "secondary"
              }
            >
              Use this mode to chat with an AI bot about anything you want.
            </Typography.Paragraph>
            {newThreadMode !== "Standard Chat" && (
              <Button onClick={() => handleModeSelection("Standard Chat")}>
                Standard Chat Mode
              </Button>
            )}
            {newThreadMode === "Standard Chat" && <Divider />}
            {newThreadMode === "Standard Chat" && (
              <Space direction="vertical">
                <Typography.Text>
                  Give your thread a title. (Optional)
                </Typography.Text>
                <Input value={newTitle} onChange={handleSetTitle} />
                <Typography.Text>
                  Tell the AI what you need help with / Give some initial
                  instructions / Describe key context. (Optional)
                </Typography.Text>
                <TextArea
                  value={newThreadInstructions}
                  onChange={handleSetInstructions}
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                />
                <Button type="primary" onClick={handleCreateStandardThread}>
                  Create Thread
                </Button>
              </Space>
            )}
          </Card>
        </Col>
        <Col span={12}>
          {/* DOC QA CHAT CARD */}
          <Card>
            <Typography.Title
              type={
                newThreadMode === "Doc QA Chat" || newThreadMode === ""
                  ? "default"
                  : "secondary"
              }
              level={4}
            >
              Document QA Chat
            </Typography.Title>
            <Typography.Paragraph
              type={
                newThreadMode === "Doc QA Chat" || newThreadMode === ""
                  ? "default"
                  : "secondary"
              }
            >
              Use this mode if you want to use AI to chat with your documents.
            </Typography.Paragraph>
            {newThreadMode !== "Doc QA Chat" && (
              <Button onClick={() => handleModeSelection("Doc QA Chat")}>
                Doc QA Chat Mode
              </Button>
            )}
            {newThreadMode === "Doc QA Chat" && <Divider />}
            {newThreadMode === "Doc QA Chat" && (
              <Space direction="vertical">
                <Typography.Text>
                  Give your thread a title. (Optional)
                </Typography.Text>
                <Input value={newTitle} onChange={handleSetTitle} />
                <Divider />
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleCreateDocQAThread}
                >
                  Add Documents
                </Button>
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default NewThreadModal;
