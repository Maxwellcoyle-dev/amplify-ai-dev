import React, { useState } from "react";

// Custom hooks
import useFileUpload from "../../hooks/useFileUpload";

// Ant Design
import { Form, Upload, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AttachmentForm = ({
  threadID,
  showAttachmentForm,
  setShowAttachmentForm,
}) => {
  const [fileList, setFileList] = useState([]);
  const { uploadFile, loading, error, cancelFileUpload } = useFileUpload();

  const handleOk = () => {
    setShowAttachmentForm(false);
  };

  const handleCancel = () => {
    setFileList([]);
    cancelFileUpload();
    setShowAttachmentForm(false);
  };

  return (
    <Modal
      title="Upload Files to this Thread"
      open={showAttachmentForm}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form layout="horizantal">
        <Form.Item
          label="upload"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            setFileList(e.fileList);
            return e.fileList;
          }}
        >
          <Upload
            customRequest={({ file }) => uploadFile(file, threadID)}
            fileList={fileList}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
      {loading && <p>Uploading...</p>}
      {error && <p>Error Uploading File : {error.message} </p>}
    </Modal>
  );
};

export default AttachmentForm;
