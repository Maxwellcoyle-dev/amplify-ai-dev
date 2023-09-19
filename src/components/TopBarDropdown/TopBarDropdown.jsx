import React, { useState } from "react";

// Material UI Imports for Dropdown
import { Select } from "antd";

// Custom Components
import Text from "../Text/Text";

// Styles
import styles from "./TopBarDropdown.module.css";

const TopBarDropdown = () => {
  const [mode, setMode] = useState("Course Writing");

  const handleChange = (value) => {
    setMode(value);
  };

  return (
    <div className={styles.container}>
      <Text text="Mode" styleType="topBarLabel" />
      <Select
        size="large"
        style={{ width: 200 }}
        defaultValue="Course Writer"
        placeholder="Select a Mode"
        onChange={handleChange}
        filterOption={(option) => option?.label ?? "Course Writer"}
        options={[
          {
            value: "GPT4",
            label: "GPT4",
          },
        ]}
      />
    </div>
  );
};

export default TopBarDropdown;
