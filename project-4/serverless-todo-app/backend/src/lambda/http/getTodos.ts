import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda"
import "source-map-support/register"

import { getAllTodos } from "../../businessLogic/todos"
import { getUserId } from "../utils"

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event)

  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const items = await getAllTodos(userId)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items
    })
  }
}
