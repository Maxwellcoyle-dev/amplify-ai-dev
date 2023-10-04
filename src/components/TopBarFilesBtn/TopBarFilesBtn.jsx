import React, { useContext } from "react";

// State Management
import { AppDispatchContext } from "../../state/AppContext";
import { SHOW_ATTACHMENT_MODAL } from "../../state/actions/actionTypes";

// Ant Design
import { Button } from "antd";

const TopBarFilesBtn = () => {
  const dispatch = useContext(AppDispatchContext);

  const handleClick = (event) => {
    event.preventDefault();
    dispatch({ type: SHOW_ATTACHMENT_MODAL });
  };

  return (
    <Button type="primary" ghost onClick={handleClick}>
      Thread Attachments
    </Button>
  );
};

export default TopBarFilesBtn;
