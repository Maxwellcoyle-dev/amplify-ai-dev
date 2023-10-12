import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Context & Actions
import { AppStateContext, AppDispatchContext } from "../state/AppContext";
import { ADD_MESSAGE } from "../state/actions/actionTypes";

// Hooks
import usePushCurrentThread from "./usePushCurrentThread";

// Stream URL - This is the URL for the AWS Lambda function that is running the model
const url =
  "https://2bqtiy2yixbxo6ofp2eoh3mqpq0bhxqf.lambda-url.us-east-2.on.aws/";

const useLLMStream = () => {
  const [streamedResponse, setStreamedResponse] = useState("");
  const [assistantMessageID, setAssistantMessageID] = useState(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [controller, setController] = useState(null);

  const state = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  // define setUpdateCurrentThread to update the current thread after a message is recieved
  const { setUpdateCurrentThread } = usePushCurrentThread();

  // Set up a one time unique id for the assistant message
  if (assistantMessageID === null) setAssistantMessageID(uuidv4());

  // Listen to the streamedResponse State and call ADD_MESSAGE when it changes
  useEffect(() => {
    if (streamedResponse === "") return;
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        role: "assistant",
        content: streamedResponse,
        messageID: assistantMessageID,
      },
    });
  }, [streamedResponse]);

  // function to send message to function URL and recieve streamed response
  const fetchChatStream = async (userMessage) => {
    setStreamedResponse("");
    setStreamLoading(true);
    setStreamError(false);
    setAssistantMessageID(null);

    // Create a unique message ID
    const messageID = uuidv4();

    dispatch({
      type: ADD_MESSAGE,
      payload: { role: "user", content: userMessage, messageID: messageID },
    });

    // Set up controller to abort fetch request if user sends another message or cancels
    const newContoller = new AbortController();
    setController(newContoller);
    const signal = newContoller.signal;

    // get only message.role and message.content from the current thread messages array not message.messageID
    const mappedMessageThread = state.threadData.currentThread.messages?.map(
      (message) => {
        return { role: message.role, content: message.content };
      }
    );

    // add { role: "user", content: userMessage } to the mappedMessageThread array

    let currentMessageThread = [];

    if (!mappedMessageThread) {
      currentMessageThread = [{ role: "user", content: userMessage }];
    } else {
      currentMessageThread = [
        ...mappedMessageThread,
        { role: "user", content: userMessage },
      ];
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentMessageThread),
        signal,
      });

      // set up reader to pipr stream into TextDecoderStream
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("Stream complete");
          setUpdateCurrentThread(true);
          setStreamLoading(false);
          break;
        }
        setStreamedResponse((prev) => prev + value);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Stream aborted");
        setStreamLoading(false);
        setStreamError(true);
        return;
      } else {
        setStreamLoading(false);
        setStreamError(true);
        console.log("Stream error");
        console.log(error);
      }
    }
  };

  const cancelStream = () => {
    if (controller) controller.abort();
  };

  return {
    fetchChatStream,
    cancelStream,
    streamLoading,
    streamError,
  };
};

export default useLLMStream;
