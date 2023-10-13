export const buildMessageLists = (currentThreadMessages, newQuestion) => {
  // check if there are messages in the current thread
  let bufferMessageList = [];
  let messageList = [];

  if (currentThreadMessages?.L?.length > 0) {
    // Buffer Memory List
    const currentBufferMessageList = currentThreadMessages?.L?.map(
      (message) => {
        return {
          role: message.M.role.S,
          content: message.M.content.S,
        };
      }
    );

    bufferMessageList = [
      ...currentBufferMessageList,
      {
        role: "user",
        content: newQuestion,
      },
    ];

    // Message List
    const currentMessageList = currentThreadMessages?.L?.map((message) => {
      return {
        role: message.M.role.S,
        content: message.M.content.S,
        messageID: message.M.messageID.S,
      };
    });

    messageList = [
      ...currentMessageList,
      {
        role: "user",
        content: newQuestion,
        messageID: uuidv4(),
      },
    ];
  } else {
    // if there are no messages in the current thread
    // create a new buffer message list with the new question

    // buffer message lsit
    bufferMessageList = [
      {
        role: "user",
        content: newQuestion,
      },
    ];

    // message list
    messageList = [
      {
        role: "assistant",
        content: "placeholder",
        messageID: "placeholder",
      },
    ];
  }

  return { bufferMessageList, messageList };
};
