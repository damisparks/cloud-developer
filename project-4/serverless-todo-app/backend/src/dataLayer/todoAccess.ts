import * as AWS from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { TodoItem } from "../models/TodoItem"

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ) { }

    /**
     * @returns list of todos as Todo
     */

    async getAllTodos(): Promise<TodoItem[]> {
        console.log('Getting all todos')
        const result = await this.docClient.scan({
            TableName: this.todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    /**
     * @returns created todo item. 
     */
    async createTodo(todo: TodoItem): Promise<TodoItem> {
        console.log('Creating a todo : ', todo.todoId)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }
}