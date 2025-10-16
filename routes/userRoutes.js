import express from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js"

const router = express.Router()



/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - users
 *     summary: Register a new user
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: User already exists
 */
router.route("/register").post(registerUser)


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: Login user
 *     description: Authenticate a user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.route("/login").post(loginUser)

router.route("/refresh").post(refreshAccessToken)


/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - users
 *     summary: Logout user
 *     description: Logout the currently authenticated user
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Not authenticated
 */
router.route("/logout").get(logoutUser)

export default router
