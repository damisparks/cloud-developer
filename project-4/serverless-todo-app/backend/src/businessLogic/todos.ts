import * as uuid from "uuid"
import { APIGatewayEvent } from "aws-lambda"

import { TodoAccess } from "../dataLayer/todoAccess"
import { getUserId } from "../lambda/utils"
import { TodoItem } from "../models/TodoItem"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"

const todoAccess = new TodoAccess()

// Get User's Todos
export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

// Create Todo Item
export async function createTodoItem({
  createATodoItem,
  event
}: {
  createATodoItem: CreateTodoRequest
  event: APIGatewayEvent
}): Promise<TodoItem> {
  const itemId = uuid.v4()
  const userId = getUserId(event)

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createATodoItem.name,
    done: false,
    createdAt: new Date().toISOString(),
    dueDate: createATodoItem.dueDate
  })
}

// Generate PreSignedUrl
export async function generatePresignedUrl(todoId: string) {
  return todoAccess.generateUploadUrl(todoId)
}
