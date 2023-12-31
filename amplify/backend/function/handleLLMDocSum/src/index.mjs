/* Amplify Params - DO NOT EDIT
	ENV
	FUNCTION_HANDLEGETFILES_NAME
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

// Custom Code Imports
import { getFile } from "../../handleLLMDocQAConversation/src/getFile.mjs";
import { saveFile } from "../../handleLLMDocQAConversation/src/saveFile.mjs";
import { sumFiles } from "../../handleLLMDocQAConversation/src/docQA.mjs";

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

    // Get the body and save to payload
    const files = JSON.parse(event.body); // Expecting an array of file keys

    // Return an error if no files are recieved in the body
    if (files.length < 1) return { statusCode: 400, body: "No files found" };

    let filePaths = [];
    for (let i = 0; i < files.length; i++) {
      const buffer = await getFile(
        "amplifyaistoragebucket134815-dev",
        files[i]
      );
      const newFilePath = saveFile(buffer, files[i]);
      filePaths.push(newFilePath);
    }

    const result = await sumFiles();
    console.log("result: ", result);
    console.log("result type: ", typeof result);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    throw error; // If you want to end the execution in case of an error
  }
};
