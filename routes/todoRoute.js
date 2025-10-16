import express from "express";
// import authentication from "../auth/authentication.js";
// import role from "../helpers/role.js";
// import { RoleCode } from "../models/role.model.js";
// import authorization from "../auth/authorization.js";
import { createTodo, getTodos, deleteTodo, editTodo } from "../controller/todo.controller.js";
import apiKey from "../auth/apiKey.js";
import protect from '../middleware/authMiddleware.js'
import { Permission } from "../modals/apiKey.modal.js";
import permission from "../helpers/permission.js";
import authentication from "../auth/authentication.js";
import authorization from "../auth/authorization.js";
import roleMiddleware from "../helpers/role.js";
import { RoleCode } from "../modals/role.model.js";

const router = express.Router();

// Apply middlewares
router.use(apiKey);
// router.use(protect);  // JWT se req.user populate karega
router.use(permission(Permission.GENERAL));

/**
 * TODO ROUTES
 */






/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *     Bearer:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the todo
 *         description:
 *           type: string
 *           description: Detailed description of the todo
 *         status:
 *           type: boolean
 *           default: false
 *           description: Status of the todo
 */


// Create a new todo

/**
 * @swagger
 * /api/todos:
 *   post:
 *     tags:
 *       - todos
 *     summary: Create a new todo
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       401:
 *         description: Not authenticated
 *       400:
 *         description: Invalid input data
 */

// router.post("/", role(RoleCode.USER), authorization, createTodo);
router.post("/",authentication, createTodo);



/**
 * @swagger
 * /api/todos:
 *   get:
 *     tags:
 *       - todos
 *     summary: Get all todos for authenticated user
 *     security:
 *       - ApiKeyAuth: []
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Not authenticated
 */
// router.get("/", role(RoleCode.USER), authorization, getTodos);
router.get("/", authentication,roleMiddleware(RoleCode.ADMIN), authorization, getTodos);


router.put("/:id", editTodo);
router.delete("/:id", deleteTodo);
router.put("/:id/status", editTodo);

export default router;
