import React from "react";

// Custom Components
import TopBarTitle from "../TopBarTitle/TopBarTitle";
import TopBarMenu from "../TopBarMenu/TopBarMenu";

const TopBar = ({ setShowAttachmentModal }) => {
  return (
    <>
      <TopBarTitle />
      <p>GPT-4</p>
      <TopBarMenu setShowAttachmentModal={setShowAttachmentModal} />
    </>
  );
};

export default TopBar;
