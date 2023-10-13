// Gets the current thread messages from dynamoDB

import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

// payload definition
// userID = "string"
// threadID = "string"

export const getThreadMessages = async (userID, threadID) => {
  try {
    console.log("userID: ", userID);
    console.log("threadID: ", threadID);
    const params = {
      TableName: "amplifyAiProjectTable-dev",
      Key: {
        UserID: { S: userID },
        ThreadID: { S: threadID },
      },
    };

    const data = await ddbClient.send(new GetItemCommand(params));
    console.log("Get Thread Data - ", data.Item);
    // L: [
    // { M: [Object] }
    // ]

    const currentThreadMessages = data.Item.Messages;

    return currentThreadMessages;
  } catch (err) {
    console.error("GetThread Error: ", err);
    return err;
  }
};
