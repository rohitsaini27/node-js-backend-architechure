import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsUrl } from "./config/config.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoute.js";
import errorHandler from "./middleware/errorMiddleware.js";
import swagger from "./swagger.js";

const app = express();

// Middlewares
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api-docs", swagger);


// Error handler
app.use(errorHandler);

export default app;
