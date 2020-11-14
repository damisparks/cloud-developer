import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda"
import "source-map-support/register"

import { getAllTodos } from "../../businessLogic/todos"
import { createLogger } from "../../utils/logger"
import { getUserId } from "../utils"

const logger = createLogger("getTodos")

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event: ", event)

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
