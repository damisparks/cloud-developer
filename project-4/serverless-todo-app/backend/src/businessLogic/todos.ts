import { APIGatewayEvent } from "aws-lambda"
import * as uuid from "uuid"
import { TodoAccess } from "../dataLayer/todoAccess"
import { getUserId } from "../lambda/utils"
import { TodoItem } from "../models/TodoItem"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodoItem(
  createATodoItem: CreateTodoRequest,
  event: APIGatewayEvent
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const userId = getUserId(event)

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createATodoItem.name,
    done: createATodoItem.done,
    createdAt: new Date().toISOString(),
    dueDate: createATodoItem.dueDate,
  })
}
