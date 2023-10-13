import React, { useContext, useEffect, useState } from "react";

// Ant Design
import {
  List,
  Avatar,
  Button,
  Upload,
  Row,
  Col,
  Space,
  Typography,
  Flex,
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
import { upload } from "@testing-library/user-event/dist/upload";

const AddFiles = () => {
  const [fileList, setFileList] = useState([]);

  const dispatch = useContext(AppDispatchContext);

  const { threadData } = useContext(AppStateContext);
  const threadID = threadData?.currentThread?.threadID;
  const currentThreadFiles = threadData?.currentThread?.files;

  // Custom Hooks
  const { deleteFile, fileDeleteLoading, fileDeleteError } = useDeleteFile();
  const { uploadFile, fileUploadLoading, fileUploadError, cancelFileUpload } =
    useFileUpload();

  // Component Methods
  const handleClose = () => {
    dispatch({ type: "HIDE_ATTACHMENT_MODAL" });
  };

  const handleDeleteFile = (fileKey) => {
    console.log("fileId", fileKey);
    deleteFile(fileKey, threadID);
  };

  useEffect(() => {
    console.log("upload file triggered");
  }, [uploadFile]);

  return (
    <Flex vertical gap="small">
      <Upload
        customRequest={({ file }) => uploadFile(file, threadID)}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>Add File</Button>
      </Upload>
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
    </Flex>
  );
};

export default AddFiles;
