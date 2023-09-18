/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_THREADTABLE_ARN
	STORAGE_THREADTABLE_NAME
	STORAGE_THREADTABLE_STREAMARN
	STORAGE_TRAINICITYAISTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */
const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const s3Client = new S3Client({ region: REGION });
const ddbClient = new DynamoDBClient({ region: REGION });

const putFileToBucket = async (body) => {
  let newBody;

  try {
    newBody = JSON.parse(body);
  } catch (error) {
    console.error("Error parsing body: ", error);
    return;
  }

  requestBody = JSON.parse(newBody);

  const fileBuffer = Buffer.from(requestBody.fileData, "base64");

  console.log("fileBuffer: ", fileBuffer);

  //   Define S3 object params
  const params = {
    Bucket: "amplifyaistoragebucket134815-dev",
    Key: `${requestBody.userID}/${requestBody.threadID}/${requestBody.fileName}`,
    Body: fileBuffer,
  };

  // Upload file to S3
  try {
    const response = await s3Client.send(new PutObjectCommand(params));

    const returnBody = {
      fileName: requestBody.fileName,
      fileURL: `https://amplifyaistoragebucket134815-dev.s3.us-east-2.amazonaws.com/${requestBody.userID}/${requestBody.threadID}/${requestBody.fileName}`,
      fileKey: `${requestBody.userID}/${requestBody.threadID}/${requestBody.fileName}`,
      userID: requestBody.userID,
      threadID: requestBody.threadID,
      success: true,
      response: response,
    };

    console.log("Success", response);
    return returnBody;
  } catch (err) {
    console.error("Error", err);
    console.error("Error Message: ", err.message);
    console.error("Error Stack: ", err.stack);
  }
};

const updateDBTable = async (userID, threadID, fileName, fileKey, fileURL) => {
  console.log("updateDBTable: ", userID, threadID, fileName, fileKey, fileURL);

  try {
    const params = {
      TableName: "amplifyAiProjectTable-dev",
      Key: {
        UserID: { S: userID },
        ThreadID: { S: threadID },
      },
      UpdateExpression:
        "SET #files = list_append(if_not_exists(#files, :empty_list), :new_file)",
      ExpressionAttributeNames: {
        "#files": "Files",
      },
      ExpressionAttributeValues: {
        ":new_file": {
          L: [
            {
              M: {
                fileName: { S: fileName },
                fileKey: { S: fileKey },
                fileURL: { S: fileURL },
              },
            },
          ],
        },
        ":empty_list": { L: [] },
      },
    };

    console.log(params);

    const response = await ddbClient.send(new UpdateItemCommand(params));
    console.log("Success", response);
    return {
      success: true,
      message: "Successfully updated DynamoDB",
      data: response,
    };
  } catch (err) {
    console.error("Error updating DynamoDB: ", err);
    console.error("Error Message: ", err.message);
    console.error("Error Stack: ", err.stack);
    throw new Error("Error updating DynamoDB: ", err);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  let dynamoDBResponse;

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

    const body = event.body;

    try {
      const s3Response = await putFileToBucket(body);
      console.log("S3 Upload Success", s3Response);

      try {
        dynamoDBResponse = await updateDBTable(
          s3Response.userID,
          s3Response.threadID,
          s3Response.fileName,
          s3Response.fileKey,
          s3Response.fileURL
        );
        console.log(dynamoDBResponse.message, dynamoDBResponse.data);
      } catch (error) {
        console.error(
          "DynamoDB update failed after successful S3 upload",
          error.message
        );
        throw error; // Re-throwing to handle it in the outer catch block, if necessary
      }
    } catch (err) {
      console.error("Error during S3 upload or DynamoDB update", err);
      console.error("Error Message: ", err.message);
      console.error("Error Stack: ", err.stack);
      throw err; // Re-throwing to handle it in the outer catch block, if necessary
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
