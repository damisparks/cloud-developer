import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda"
import * as AWS from "aws-sdk"
import "source-map-support/register"

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event)
  // TODO: Get all TODO items for a current user

  // Current : Get all todos.
  const result = await docClient
    .scan({
      TableName: todosTable
    })
    .promise()

  const items = result.Items

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
