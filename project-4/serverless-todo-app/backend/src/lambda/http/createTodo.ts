import "source-map-support/register"
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda"
import { CreateTodoRequest } from "../../requests/CreateTodoRequest"
import { createTodoItem } from "../../businessLogic/todos"
import { createLogger } from "../../utils/logger"

const logger = createLogger("createTodo")

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  logger.info("Processing newTodoItem: ", newTodoItem)

  const item = await createTodoItem({ createATodoItem: newTodoItem, event })

  logger.info("TODO : ", item)
  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      item
    })
  }
}
