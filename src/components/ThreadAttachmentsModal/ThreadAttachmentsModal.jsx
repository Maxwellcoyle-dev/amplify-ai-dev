import React, { useContext, useState } from "react";

// Ant Design
import {
  Modal,
  List,
  Avatar,
  Button,
  Upload,
  Row,
  Col,
  Space,
  Typography,
  Input,
} from "antd";
import {
  UploadOutlined,
  FileOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../../state/AppContext";

// Custom Hooks
import useDeleteFile from "../../hooks/useDeleteFile";
import useFileUpload from "../../hooks/useFileUpload";
import useUpdateThreadUrls from "../../hooks/useUpdateThreadUrls";

const ThreadAttachmentsModal = () => {
  const [fileList, setFileList] = useState([]);
  const [urlList, setUrlList] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const dispatch = useContext(AppDispatchContext);

  // Global State
  const { threadData, showAttachmentModal } = useContext(AppStateContext);

  // Destructure threadID, currentThreadFiles, currentThreadUrls from threadData
  const threadID = threadData?.currentThread?.threadID;
  const currentThreadFiles = threadData?.currentThread?.files;
  const currentThreadUrls = threadData?.currentThread?.urls;

  // Custom Hooks
  const { deleteFile, fileDeleteLoading, fileDeleteError } = useDeleteFile();
  const { uploadFile, fileUploadLoading, fileUploadError, cancelFileUpload } =
    useFileUpload();
  const { updateThreadUrls, updateUrlListLoading, updateThreadUrlsError } =
    useUpdateThreadUrls();

  // Component Methods
  const handleClose = () => {
    dispatch({ type: "HIDE_ATTACHMENT_MODAL" });
    setShowUrlInput(false);
    setUrlInput("");
  };

  const handleDeleteFile = (fileKey) => {
    console.log("fileId", fileKey);
    deleteFile(fileKey, threadID);
  };

  // const handleDeleteUrl = (url) => {
  //   const newUrls = currentThreadUrls.filter((item) => item.url !== url);
  //   updateThreadUrls(newUrls, threadID);
  //   setUrlList(newUrls);
  // };

  // const handleAddUrl = () => {
  //   setUrlList([...urlList, urlInput]);
  //   setUrlInput("");
  //   setShowUrlInput(false);

  //   const newUrls = [...urlList, urlInput];
  //   updateThreadUrls(newUrls, threadID);
  // };

  // const handleUrlChange = (event) => {
  //   setUrlInput(event.target.value);
  // };

  // const handleShowUrlInput = () => {
  //   setShowUrlInput(true);
  // };

  // const handleCloseUrlInput = () => {
  //   setShowUrlInput(false);
  //   setUrlInput("");
  // };

  return (
    <Modal
      open={showAttachmentModal}
      onCancel={handleClose}
      width="50%"
      keyboard
      centered
      onOk={handleClose}
    >
      <Typography.Title level={3}>
        Add Documents to this Thread
      </Typography.Title>
      <Row gutter={24}>
        <Col>
          <Upload
            customRequest={({ file }) => uploadFile(file, threadID)}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Add File</Button>
          </Upload>
        </Col>
      </Row>
      <Row style={{ paddingTop: "1rem" }}>
        <Col span={24}>
          <List
            style={{ maxHeight: "175px", overflow: "auto" }}
            bordered
            loading={fileDeleteLoading || fileUploadLoading}
            itemLayout="horizontal"
            dataSource={currentThreadFiles}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleDeleteFile(item.fileKey)}>
                    <DeleteOutlined />
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<FileOutlined />} />}
                  title={<Typography>{item.fileName}</Typography>}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>

      {/* <Row gutter={24} style={{ paddingTop: "2rem" }}>
        <Col>
          <Typography.Title level={4}>URL Attachments</Typography.Title>
        </Col>

        <Col>
          {showUrlInput ? (
            <Space>
              <Input
                onPressEnter={handleAddUrl}
                value={urlInput}
                onChange={handleUrlChange}
              />
              <Button
                icon={<PlusCircleOutlined />}
                type="text"
                onClick={handleAddUrl}
              ></Button>
              <Button
                icon={<CloseCircleOutlined />}
                type="text"
                danger
                onClick={handleCloseUrlInput}
              ></Button>
            </Space>
          ) : (
            <Button icon={<PlusCircleOutlined />} onClick={handleShowUrlInput}>
              Add URL
            </Button>
          )}
        </Col>
      </Row>
      <Row style={{ paddingTop: "1rem" }}>
        <Col span={24}>
          <List
            bordered
            loading={updateUrlListLoading}
            itemLayout="horizontal"
            dataSource={currentThreadUrls}
            style={{ maxHeight: "175px", overflow: "auto" }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleDeleteUrl(item.url)}>
                    <DeleteOutlined />
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<FileOutlined />} />}
                  title={item.url}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row> */}
    </Modal>
  );
};

export default ThreadAttachmentsModal;
