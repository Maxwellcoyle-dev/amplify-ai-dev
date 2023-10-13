import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

export const createThread = async (requestBody) => {
  const parsedRequestBody = JSON.parse(requestBody);

  const params = {
    TableName: "amplifyAiProjectTable-dev",
    Key: {
      UserID: { S: parsedRequestBody.userID },
      ThreadID: { S: parsedRequestBody.threadID },
    },
    Item: {
      UserID: { S: parsedRequestBody.userID },
      ThreadID: { S: parsedRequestBody.threadID },
      LastUpdated: { S: parsedRequestBody.lastUpdated },
      ThreadTitle: { S: parsedRequestBody.threadTitle },
      ThreadMode: { S: parsedRequestBody.threadMode },
      ThreadInstructions: { S: parsedRequestBody.threadInstructions },
    },
  };

  try {
    const data = await ddbClient.send(new PutItemCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.error("PutThread Error: ", err);
  }
};
