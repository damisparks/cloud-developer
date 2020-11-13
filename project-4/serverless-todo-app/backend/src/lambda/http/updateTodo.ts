import "source-map-support/register"

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda"

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest"
import { getUserId } from "../utils"
import { getItemById, updateTodo } from "../../businessLogic/todos"
import { createLogger } from "../../utils/logger"

const logger = createLogger("todos")

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  // Check if item exists
  const itemExists = await getItemById(todoId, userId)

  if (!itemExists) {
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

  if (userId != itemExists.userId) {
    logger.error("User is not authorized to edit the resource.")
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "User is not authorized to edit the resource"
      })
    }
  } else {
    await updateTodo(todoId, userId, updatedTodo)
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: ""
    }
  }
}
