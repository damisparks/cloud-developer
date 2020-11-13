import "source-map-support/register"

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda"
import { createLogger } from "../../utils/logger"
import { getUserId } from "../utils"
import { deleteItem, getItemById } from "../../businessLogic/todos"

const logger = createLogger("todoDelete")

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // Check if we have a todo with that the id and userid.
  const todoItemExists = await getItemById(todoId, userId)

  if (!todoItemExists) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Todo does not exist"
      })
    }
  }

  // TODO: Remove a TODO item by id
  if (userId != todoItemExists.userId) {
    logger.error("User is not authorized to edit the resource.")
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "User is not authorized to delete this. resource"
      })
    }
  } else {
    logger.info("User was authorized to delete : ", {
      todoId: todoId
    })
    await deleteItem(todoId, userId)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: "Item deleted."
    }
  }
}
