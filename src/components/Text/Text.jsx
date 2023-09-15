import React from "react";

// styles
import styles from "./Text.module.css";

const Text = ({ text, styleType }) => {
  let styleClass;
  switch (styleType) {
    case "topBarLabel":
      styleClass = styles.topBarLabel;
      break;
    case "topBarTitle":
      styleClass = styles.topBarTitle;
      break;
    default:
      styleClass = styles.default;
  }

  return <p className={styleClass}>{text}</p>;
};

export default Text;
