import { useContext, useState } from "react";

// Context & Actions
import { AppStateContext } from "../state/AppContext";

const URL =
  "https://hpjoioquy3ubcng26elwzlzbgq0obrrs.lambda-url.us-east-2.on.aws/";

const useLLMDocSum = () => {
  const [docSumResponse, setDocSumResponse] = useState("");

  const state = useContext(AppStateContext);
  const files = state.threadData?.currentThread.files;

  let fileKeyList = [];
  if (files) fileKeyList = files?.map((file) => file.fileKey);

  const fetchDocSum = async () => {
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
      setDocSumResponse(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchDocSum,
    docSumResponse,
  };
};

export default useLLMDocSum;
