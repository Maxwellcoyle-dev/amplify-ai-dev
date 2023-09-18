const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
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

const putThread = async (requestBody) => {
  const parsedRequestBody = JSON.parse(requestBody);

  // Convert the messages array into DynamoDB format
  const messagesForDynamo = parsedRequestBody.messages.map((message) => ({
    M: {
      role: { S: message.role },
      content: { S: message.content },
      messageID: { S: message?.messageID },
    },
  }));

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
      Messages: { L: messagesForDynamo },
      ThreadTitle: { S: parsedRequestBody.threadTitle }, // Optional
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

const updateThread = async (requestBody) => {
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
      "set Messages = :messages, LastUpdated = :lastUpdated, ThreadTitle = :threadTitle",
    ExpressionAttributeValues: {
      ":messages": { L: messagesForDynamo },
      ":lastUpdated": { S: parsedRequestBody.lastUpdated },
      ":threadTitle": { S: parsedRequestBody.threadTitle },
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

    const body = event.body;

    const getThreadResponse = await getThread(body);

    if (getThreadResponse) {
      const updateThreadResponse = await updateThread(body);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(updateThreadResponse), // convert items to JSON string
      };
    } else {
      const putThreadResponse = await putThread(body);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify(putThreadResponse), // convert items to JSON string
      };
    }
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
