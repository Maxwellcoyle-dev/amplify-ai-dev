import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

export const getThread = async (requestBody) => {
  const parsedRequestBody = JSON.parse(requestBody);

  const params = {
    TableName: "amplifyAiProjectTable-dev",
    Key: {
      UserID: { S: parsedRequestBody.userID },
      ThreadID: { S: parsedRequestBody.threadID },
    },
  };
  console.log("DynamoDB Params: ", JSON.stringify(params));
  try {
    const data = await ddbClient.send(new GetItemCommand(params));
    console.log("Success", data.Item);
    return data.Item;
  } catch (err) {
    console.error("GetThread Error: ", err);
  }
};
