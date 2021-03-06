import "source-map-support/register"

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda"

import { generatePresignedUrl } from "../../businessLogic/todos"

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  // const userId = getUserId(event)
  const uploadUrl = await generatePresignedUrl(todoId)

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
