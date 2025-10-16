// import todoCache from "../cache/todoCache.js";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../core/CustomError.js";
import Todo from "../modals/todo.modal.js";

const todoService = {};

// CREATE TODO
todoService.createTodo = async (user, { title, description }) => {
  console.log(user, "userrrrr")
  if (!title || !description) {
    throw new BadRequestError("Title and Description are required");
  }
  
  const todo = await Todo.create({ user: user._id, title, description });
  // await todoCache.invalidateUserTodos(user._id.toString());
  return todo;
};

// GET TODO
// todoService.getTodos = async (user) => {
//   // 1. Check Redis cache first
//   // let cachedTodos = await todoCache.fetchUserTodos(user._id);
//   // if (cachedTodos && cachedTodos.data && cachedTodos.data.length > 0) {
//   //   console.log(cachedTodos, "cahcedtodosssssssssssssssssssssss");
//   //   return cachedTodos.data;
//   // }


//   // 2. Fetch from DB if not in cache
//   const todos = await Todo.find({ user: user._id }).populate("user", "name email createdAt updatedAt");
//   if (!todos || todos.length === 0) {
//     throw new NotFoundError("No todos found");
//   }

//   // 3. Save the DB result to cache for future requests
//   // await todoCache.saveUserTodos(user._id.toString(), todos);

//   return todos;
// };


todoService.getTodos = async (user) => {
  const todos = Todo.aggregate([
    {$match: {user: user._id}},

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },

    {$unwind: "$user"},

    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        "user._id": 1,
        "user.name": 1,
        "user.email": 1,
        "user.createdAt": 1,
        "user.updatedAt": 1
        // password & isAdmin not included
      }
    }
  ])

  if (!todos || todos.length === 0) {
    throw new NotFoundError("No todos found");
  }

  return todos;
}

// todoService.getTodos = async (user) => {

//   let todos = await Todo.find({ user: user._id });
//   if (!todos || todos.length === 0) {
//     throw new NotFoundError("No todos found");
//   }
//   return todos;
// };

// EDIT TODO
todoService.editTodo = async (user, todoId, { title, description, status }) => {
  if (!title || !description || !status) {
    throw new BadRequestError("Title, Description, and Status are required");
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    throw new NotFoundError("Todo not found");
  }

  if (todo.user.toString() !== user._id.toString()) {
    throw new UnauthorizedError("Not authorized to update this todo");
  }

  todo.title = title;
  todo.description = description;
  todo.status = status;

  const updatedTodo = await todo.save();
  return updatedTodo;
};

// DELETE TODO
todoService.deleteTodo = async (todoId) => {
  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new NotFoundError("Todo not found");
  }

  await todo.deleteOne();
  return { message: "Todo removed" };
};

export default todoService;
