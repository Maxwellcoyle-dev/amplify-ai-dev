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
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
        body: JSON.stringify('Hello from Lambda!'),
    };
};