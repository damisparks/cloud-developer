import * as uuid from "uuid"
import { APIGatewayEvent } from "aws-lambda"

import { TodoAccess } from "../dataLayer/todoAccess"
import { getUserId } from "../lambda/utils"
import { TodoItem } from "../models/TodoItem"
import { CreateTodoRequest } from "../requests/CreateTodoRequest"
import { TodoUpdate } from "../models/TodoUpdate"

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

// Update todo
export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoItem: TodoUpdate
) {
  return await todoAccess.updateTodo(todoId, userId, updateTodoItem)
}

// Get item by Todo Item Id.
export async function getItemById(todoId: string, userId: string) {
  return await todoAccess.getItemByTodoItemId(todoId, userId)
}

// Delete item by id.
export async function deleteItem(todoId: string, userId: string) {
  return await todoAccess.deleteTodoItem(todoId, userId)
}
