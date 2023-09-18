/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_THREADTABLE_ARN
	STORAGE_THREADTABLE_NAME
	STORAGE_THREADTABLE_STREAMARN
Amplify Params - DO NOT EDIT */

const {
  DynamoDBClient,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

const deleteThread = async (requestBody) => {
  const parsedRequestBody = JSON.parse(requestBody);

  const params = {
    TableName: "amplifyAiProjectTable-dev",
    Key: {
      UserID: { S: parsedRequestBody.userID },
      ThreadID: { S: parsedRequestBody.threadID },
    },
  };

  try {
    const data = await ddbClient.send(new DeleteItemCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.error("DeleteThread Error: ", err);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
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

    const deleteThreadResponse = await deleteThread(body);
    console.log("deleteThreadResponse: ", deleteThreadResponse);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(deleteThreadResponse), // convert items to JSON string
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
