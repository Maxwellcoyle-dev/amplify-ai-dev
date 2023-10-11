import { useContext, useState } from "react";

// Context & Actions
import { AppStateContext } from "../state/AppContext";

const URL =
  "https://ol62tnwqr2jpnenz2t3lqwpnqm0fecjc.lambda-url.us-east-2.on.aws/";

const useLLMDocSum = () => {
  const [docQAResponse, setDocQAResponse] = useState("");

  const state = useContext(AppStateContext);
  const files = state.threadData?.currentThread.files;

  let fileKeyList = [];
  if (files) fileKeyList = files?.map((file) => file.fileKey);

  const fetchDocQA = async () => {
    try {
      if (fileKeyList.length < 1) return "No files";
      console.log(fileKeyList);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fileKeyList),
      });
      const data = await response.json();
      setDocQAResponse(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchDocQA,
    docQAResponse,
  };
};

export default useLLMDocSum;
