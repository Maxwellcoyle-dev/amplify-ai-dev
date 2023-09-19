import React, { useEffect, useState } from "react";

// Context Provider
import AppProvider from "./state/AppProvider";

// Styles
import styles from "./App.module.css";
import topBarStyles from "./components/TopBar/TopBar.module.css";

// Ant UI
import { Layout } from "antd";

// Custom Components
import SidePanel from "./pages/SidePanel/SidePanel";
import Main from "./pages/Main/Main";
import TopBar from "./components/TopBar/TopBar";

// Amplify API
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const handleCollapse = (value) => {
    setCollapsed(value);
  };

  return (
    <AppProvider>
      <Layout className={styles.container}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={handleCollapse}
          theme="light"
        >
          <SidePanel setCollapsed={setCollapsed} collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header className={topBarStyles.topBar}>
            <TopBar setShowAttachmentModal={setShowAttachmentModal} />
          </Header>
          <Content>
            <Main
              showAttachmentModal={showAttachmentModal}
              setShowAttachmentModal={setShowAttachmentModal}
            />
          </Content>
        </Layout>
      </Layout>
    </AppProvider>
  );
};
export default withAuthenticator(App);
