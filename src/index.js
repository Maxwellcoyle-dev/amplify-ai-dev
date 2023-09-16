import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// styles
import "./global.css";

// Amplify
import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);
Auth.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
