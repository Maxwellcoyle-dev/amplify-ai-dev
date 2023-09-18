/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	OPENAI_API_KEY
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const axios = require("axios");

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

    if (event.requestContext.authorizer) {
      console.log(`CLAIMS: `, event.requestContext.authorizer.claims);
    }

    // Parse the body as JSON
    const body = JSON.parse(event.body);
    const conversation = body.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    console.log("CONVERSATION: ", conversation);

    const openaiEndpoint = "https://api.openai.com/v1/chat/completions";

    // Construct the data payload based on what you want to ask OpenAI.
    // Adjust this according to your needs.
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you are an expert instructional designer providing creative solutions based on industry best practices to solve complex problems and answer questions in detail.",
        },
        ...conversation,
      ],
      max_tokens: 200,
    };

    console.log(`PAYLOAD: ${JSON.stringify(payload)}`); // Log the payload

    try {
      const apiResponse = await axios.post(openaiEndpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      console.log(`API RESPONSE: ${JSON.stringify(apiResponse.data)}`); // Log the API response

      // Extract the completion text from OpenAI's response
      const completionText = apiResponse.data.choices[0].message.content;

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, Accept, X-Requested-With",
        },
        body: JSON.stringify({ completionText }),
      };
      return response;
    } catch (error) {
      console.error("Error calling openAI: ", error.message);
      console.error("Error details: ", error); // Log the error object

      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, Accept, X-Requested-With",
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
  } catch (error) {
    console.error("Error calling openAI: ", error.message);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, Accept, X-Requested-With",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
