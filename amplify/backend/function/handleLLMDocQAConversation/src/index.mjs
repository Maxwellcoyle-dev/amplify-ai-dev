/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_HANDLEGETFILES_NAME
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

// Custom Code Imports
import { getFile } from "./utilities/getFile.mjs";
import { saveFile } from "./utilities/saveFile.mjs";
import { langChainMain } from "./utilities/langChainMain.mjs";
import { getOpenAIKey } from "./utilities/getOpenAIKey.mjs";

// event.body definition
//  {
//   files: ["string"],
//   question: "string",
//   userID: "string",
//   threadID: "string",
// };

export const handler = async (event) => {
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

    const OPENAI_API_KEY = await getOpenAIKey();

    // Get the body and save to payload
    const payload = JSON.parse(event.body); // Expecting an array of file keys
    console.log("payload: ", payload);

    // Return an error if no files are recieved in the body
    if (payload.files?.length < 1)
      return { statusCode: 400, body: "No files found" };

    let filePaths = [];
    for (let i = 0; i < payload.files?.length; i++) {
      const buffer = await getFile(
        "amplifyaistoragebucket134815-dev",
        payload.files[i]
      );
      const newFilePath = saveFile(buffer, payload.files[i]);
      filePaths.push(newFilePath);
    }

    // payload for main function
    const mainPayload = {
      apiKey: OPENAI_API_KEY,
      question: payload.question,
      instructions: payload.instructions,
      userID: payload.userID,
      threadID: payload.threadID,
    };

    const result = await langChainMain(mainPayload);

    console.log("result: ", result);

    return {
      statusCode: 200,
      body: JSON.stringify(result.res),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
