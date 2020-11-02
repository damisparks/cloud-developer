import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //  Implement creating a new TODO item
  const todoId = uuid.v4()
  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)
  console.log('Processing newTodoItem: ', newTodoItem)

  const item: TodoItem = {
    todoId : todoId,
    userId: 'fakeuserid',
    name: newTodoItem.name,
    dueDate: newTodoItem.dueDate,
    done: false,
    createdAt: new Date().toISOString()
    // ...newTodoItem
  }

  await docClient.put({
    TableName: todosTable,
    Item: item
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
