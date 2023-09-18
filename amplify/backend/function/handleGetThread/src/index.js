const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const REGION = "us-east-2";
const ddbClient = new DynamoDBClient({ region: REGION });

const getThread = async (requestBody) => {
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

    const getThreadResponse = await getThread(body);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(getThreadResponse), // convert items to JSON string
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
