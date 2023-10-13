import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

// payload definition
// {
//   "userID": "string",
//   "threadID": "string",
//   "messageList": [
//     {
//       "role": "string",
//       "content": "string",
//       "messageID": "string"
//     }
//   ]
//   "assistantResponse": "string"
// }

export const updateThread = async (payload) => {
  // Set the lastUpdated timestamp
  const lastUpdated = Date.now().toString();

  // build a new message list with the old list + the assiatnt response
  const newMessageList = [
    ...payload.messageList,
    {
      role: "assistant",
      content: payload.assistantResponse,
      messageID: uuidv4(),
    },
  ];

  // Convert the messages array into DynamoDB format
  const messagesForDynamo = newMessageList?.map((message) => ({
    M: {
      role: { S: message.role },
      content: { S: message.content },
      messageID: { S: message.messageID },
    },
  }));

  const params = {
    TableName: "amplifyAiProjectTable-dev",
    Key: {
      UserID: { S: payload.userID },
      ThreadID: { S: payload.threadID },
    },
    UpdateExpression: "set Messages = :messages, LastUpdated = :lastUpdated",
    ExpressionAttributeValues: {
      ":messages": { L: messagesForDynamo },
      ":lastUpdated": { S: lastUpdated },
    },
  };

  try {
    const data = await ddbClient.send(new UpdateItemCommand(params));
    console.log("Update Thread Success - Data: ", data);
    return data;
  } catch (err) {
    console.error("UpdateThread Error: ", err);
    return err;
  }
};
