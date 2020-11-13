import * as AWS from "aws-sdk"
import { S3 } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from "../models/TodoUpdate"

export class TodoAccess {
  constructor(
    private readonly s3: S3 = new AWS.S3({ signatureVersion: "v4" }),
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX,
    private readonly urlExpiration: string = process.env.SIGNED_URL_EXPIRATION,
    private readonly bucketName: string = process.env.IMAGE_S3_BUCKET
  ) {}

  /**
   * @returns list of todos of authenticated user.
   */

  async getAllTodos(userId): Promise<TodoItem[]> {
    console.log("Getting all todos")
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  /**
   * @returns created todo item.
   */
  async createTodo(todo: TodoItem): Promise<TodoItem> {
    console.log("Creating a todo : ", todo.todoId)

    todo.attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${todo.todoId}`
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    console.log("Todo created : ", todo)
    return todo as TodoItem
  }

  /**
   * @returns generated upload url.
   */
  async generateUploadUrl(todoId: string) {
    return this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: parseInt(this.urlExpiration)
    })
  }

  /**
   * @returns UPDATE TODO
   */
  async updateTodo(todoId: string, userId: string, updateTodoItem: TodoUpdate) {
    console.log(`to update todoItem :  ${todoId}`)
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: "set #name = :name, #dueDate = :due, #done= :d",
        ExpressionAttributeValues: {
          ":name": updateTodoItem.name,
          ":due": updateTodoItem.dueDate,
          ":d": updateTodoItem.done
        },
        ExpressionAttributeNames: {
          "#name": "name",
          "#dueDate": "dueDate",
          "#done": "done"
        }
      })
      .promise()
  }

  /**
   * @returns GET ITEMS BY ID.
   */
  async getItemByTodoItemId(todoId: string, userId: string) {
    console.log("Getting Todo Item : ", todoId)
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      })
      .promise()
    console.log(" Get Items by id : ", result)
    return result.Item as TodoItem
  }

  // Delete item.
  async deleteTodoItem(todoId: string, userId: string) {
    console.log("Deleting todo with id : ", todoId)
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()
  }
}
