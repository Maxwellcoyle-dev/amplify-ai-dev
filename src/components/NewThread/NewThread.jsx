import React, { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";

// State Management
import { AppDispatchContext } from "../state/AppContext";
import { CREATE_NEW_THREAD } from "../state/actions/actionTypes";

// Custom Components
import Text from "../Text/Text";

// Styles
import styles from "./NewThread.module.css";

const NewThread = () => {
  const dispatch = useContext(AppDispatchContext);

  const onClick = () => {
    console.log("hello there");
    dispatch({ type: CREATE_NEW_THREAD });
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper} onClick={onClick}>
        <AiOutlinePlus />
        <Text text="New Thread" />
      </div>
    </div>
  );
};

export default NewThread;
