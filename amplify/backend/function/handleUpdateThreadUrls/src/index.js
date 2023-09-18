/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_THREADTABLE_ARN
	STORAGE_THREADTABLE_NAME
	STORAGE_THREADTABLE_STREAMARN
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const {
    DynamoDBClient,
    UpdateItemCommand,
  } = require("@aws-sdk/client-dynamodb");
  const REGION = "us-east-2";
  const ddbClient = new DynamoDBClient({ region: REGION });
  
  const updateThread = async (urlList, userID, threadID) => {
    const urlsForDynamo = urlList.map((url) => ({
      M: {
        url: { S: url },
      },
    }));
  
    const params = {
      TableName: "threadTable-staging",
      Key: {
        UserID: { S: userID },
        ThreadID: { S: threadID },
      },
      UpdateExpression: "SET URLs = :urls",
      ExpressionAttributeValues: {
        ":urls": { L: urlsForDynamo },
      },
    };
  
    try {
      const data = await ddbClient.send(new UpdateItemCommand(params));
      console.log("Success", data);
      return data;
    } catch (err) {
      console.error("Error", err);
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
  
      console.log(`EVENT: ${JSON.stringify(event)}`);
  
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
  
      const updateThreadResponse = await updateThread(
        body.urls,
        body.userID,
        body.threadID
      );
  
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(updateThreadResponse), // convert items to JSON string
      };
    } catch (error) {
      console.log(error);
      console.log("Error message:", error.message);
      console.log("Stack trace:", error.stack);
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  