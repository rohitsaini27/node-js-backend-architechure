import asyncHandler from "express-async-handler"
import todoService from "../services/todo.services.js";

// CREATE TODO
export const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.createTodo(req.user, req.body);
  res.status(201).json(todo);
});

// GET TODOS
export const getTodos = asyncHandler(async (req, res) => {
  const todos = await todoService.getTodos(req.user);
  res.status(200).json(todos);
});

// EDIT TODO
export const editTodo = asyncHandler(async (req, res) => {
  const updatedTodo = await todoService.editTodo(req.user, req.params.id, req.body);
  res.json(updatedTodo);
});

// DELETE TODO
export const deleteTodo = asyncHandler(async (req, res) => {
  const result = await todoService.deleteTodo(req.params.id);
  res.json(result);
});
