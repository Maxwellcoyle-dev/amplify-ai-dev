/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_AMPLIFYAIPROJECTTABLE_ARN
	STORAGE_AMPLIFYAIPROJECTTABLE_NAME
	STORAGE_AMPLIFYAIPROJECTTABLE_STREAMARN
	STORAGE_AMPLIFYAISTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import { OpenAI } from "openai";
import { getOpenAIKey } from "./getOpenAIKey.mjs";

const OPENAI_API_KEY = await getOpenAIKey();

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const handler = awslambda.streamifyResponse(
  async (event, responseStream) => {
    // Handle Preflight request
    const { httpMethod } = event;

    if (httpMethod === "OPTIONS") {
      // Handle preflight request
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // or specify your allowed origins
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Max-Age": "86400", // 24 hours
        },
        body: "",
      };
      return response;
    }
    try {
      const responseMetadata = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
      };

      responseStream = awslambda.HttpResponseStream.from(
        responseStream,
        responseMetadata
      );

      console.log("event: ", event);

      const newMessage = JSON.parse(event.body);
      console.log("newMessage: ", newMessage);

      const response = await openai.chat.completions.create(
        {
          model: "gpt-3.5-turbo-16k",
          stream: true,
          max_tokens: 14000,
          messages: [
            {
              role: "system",
              content:
                "Provide all responses in markdown format with GFM enabled. Include high level of detail in your markdown format to convey the content best.",
            },
            ...newMessage,
          ],
        },
        { responseType: "stream" }
      );

      console.log("Response:", response);

      for await (const payload of response) {
        try {
          if (payload.choices[0]?.finish_reason === "stop")
            responseStream.end();
          const text = payload.choices[0].delta?.content;
          if (text) {
            responseStream.write(text);
          }
        } catch (err) {
          console.error("Error:", err);
        }
      }
    } catch (err) {
      console.log(err);
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: err.message,
        }),
      };
      if (responseStream) responseStream.end();
      return response;
    }
    //   end response
    responseStream.end();
  }
);
