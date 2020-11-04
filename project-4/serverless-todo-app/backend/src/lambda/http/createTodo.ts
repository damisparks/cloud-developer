import "source-map-support/register"
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda"
import { CreateTodoRequest } from "../../requests/CreateTodoRequest"
import { createTodoItem } from "../../businessLogic/todos"

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  //  Implement creating a new TODO item
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  console.log("Processing newTodoItem: ", newTodoItem)

  const item = createTodoItem(newTodoItem, event)

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      item,
    }),
  }
}
