import { port, corsUrl } from "./config/config.js";
import logger from "./core/Logger.js";
import './database/index.js';
// import './cache/index.js';
import app from "./app.js";

const PORT = port ?? 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(`Server is running on port ${PORT}`);
});
