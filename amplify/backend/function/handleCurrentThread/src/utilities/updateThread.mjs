import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

export const updateThread = async (requestBody) => {
  const parsedRequestBody = JSON.parse(requestBody);
  console.log("parsedRequestBody: ", parsedRequestBody);

  // Convert the messages array into DynamoDB format
  const messagesForDynamo = parsedRequestBody.messages.map((message) => ({
    M: {
      role: { S: message.role },
      content: { S: message.content },
      messageID: { S: message.messageID },
    },
  }));

  const params = {
    TableName: "amplifyAiProjectTable-dev",
    Key: {
      UserID: { S: parsedRequestBody.userID },
      ThreadID: { S: parsedRequestBody.threadID },
    },
    UpdateExpression:
      "set Messages = :messages, LastUpdated = :lastUpdated, ThreadTitle = :threadTitle, ThreadInstructions = :threadInstructions",
    ExpressionAttributeValues: {
      ":messages": { L: messagesForDynamo },
      ":lastUpdated": { S: parsedRequestBody.lastUpdated },
      ":threadTitle": { S: parsedRequestBody.threadTitle },
      ":threadInstructions": { S: parsedRequestBody.threadInstructions },
    },
  };

  try {
    const data = await ddbClient.send(new UpdateItemCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.error("UpdateThread Error: ", err);
    console.log("UpdateThread Error message:", err.message);
    console.log("UpdateThread Stack trace:", err.stack);
  }
};
