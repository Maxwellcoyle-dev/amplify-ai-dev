/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_THREADTABLE_ARN
	STORAGE_THREADTABLE_NAME
	STORAGE_THREADTABLE_STREAMARN
	STORAGE_TRAINICITYAISTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
} = require("@aws-sdk/client-dynamodb");

const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const s3Client = new S3Client({ region: REGION });
const ddbClient = new DynamoDBClient({ region: REGION });

const deleteFileFromBucket = async (fileKey) => {
  console.log("fileKey: ", fileKey);

  try {
    const params = {
      Bucket: "amplifyaistoragebucket134815-dev",
      Key: fileKey,
    };
    const response = await s3Client.send(new DeleteObjectCommand(params));
    console.log("S3 Delete Success", response);
    return response;
  } catch (err) {
    console.error("Error", err);
    console.error("Error Message: ", err.message);
    console.error("Error Stack: ", err.stack);
  }
};

const deleteFileFromDynamoDB = async (userID, threadID, fileKeyToRemove) => {
  console.log("userID: ", userID);
  console.log("threadID: ", threadID);
  console.log("fileKey: ", fileKeyToRemove);

  const getParams = {
    TableName: "amplifyAiProjectTable-dev",
    Key: {
      UserID: { S: userID },
      ThreadID: { S: threadID },
    },
  };

  const fileListResponse = await ddbClient.send(new GetItemCommand(getParams));

  const filesList = fileListResponse.Item.Files.L;

  const updatedList = filesList.filter((file) => {
    return file.M.fileKey.S !== fileKeyToRemove;
  });

  try {
    const updateParams = {
      TableName: "amplifyAiProjectTable",
      Key: {
        UserID: { S: userID },
        ThreadID: { S: threadID },
      },
      UpdateExpression: "set Files = :files",
      ExpressionAttributeValues: {
        ":files": { L: updatedList },
      },
    };
    const response = await ddbClient.send(new UpdateItemCommand(updateParams));
    console.log("DynamoDB Delete Success", response);
    return response;
  } catch (err) {
    console.error("Error", err);
    console.error("Error Message: ", err.message);
    console.error("Error Stack: ", err.stack);
  }
};

exports.handler = async (event) => {
  try {
    // Handle possible preflight requests
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ message: "Hello World" }), // OPTIONS requests don't typically need a body
      };
    }

    if (event.requestContext?.authorizer) {
      console.log(`CLAIMS: `, event.requestContext?.authorizer?.claims);
    }

    // the actual code here
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ error: "Only POST requests are supported" }),
      };
    }

    const body = JSON.parse(event.body);
    console.log("body: ", body);
    console.log("body type: ", typeof body);

    const deleteFileFromS3 = await deleteFileFromBucket(body.fileKey);

    let dynamoDBResponse;

    if (deleteFileFromS3.DeleteMarker) {
      dynamoDBResponse = await deleteFileFromDynamoDB(
        body.userID,
        body.threadID,
        body.fileKey
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(dynamoDBResponse), // convert items to JSON string
    };
  } catch (error) {
    console.log("handler error: ", error);
    console.log("handler error: ", error.message);
    console.log("handler error: ", error.stack);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
