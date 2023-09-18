/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_AMPLIFYAIPROJECTTABLE_ARN
	STORAGE_AMPLIFYAIPROJECTTABLE_NAME
	STORAGE_AMPLIFYAIPROJECTTABLE_STREAMARN
Amplify Params - DO NOT EDIT */ const {
  DynamoDBClient,
  QueryCommand,
} = require("@aws-sdk/client-dynamodb");
const docClient = new DynamoDBClient({ region: "us-east-2" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

async function queryTable(UserID) {
  const params = {
    TableName: "amplifyAiProjectTable-dev", // replace with your table name
    KeyConditionExpression: "UserID = :userid",
    ExpressionAttributeValues: {
      ":userid": { S: UserID },
    },
  };

  try {
    const data = await docClient.send(new QueryCommand(params));
    console.log("Success", data.Items);
    return data.Items;
  } catch (err) {
    console.error(err);
  }
}

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

    const body = JSON.parse(event.body);
    const UserID = body.userID;
    const items = await queryTable(UserID);

    if (items.length === 0) {
      console.log("No items found");
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ message: "No items found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(items), // convert items to JSON string
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
