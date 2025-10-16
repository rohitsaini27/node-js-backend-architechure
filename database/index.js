import mongoose from "mongoose";
import { db, environment } from "../config/config.js";
import Logger from "../core/Logger.js";

// Build the connection string
export const dbURI = `mongodb+srv://${db.user}:${encodeURIComponent(db.password)}@${db.host}/${db.name}?retryWrites=true&w=majority`;
Logger.debug(dbURI, "dbURI");

const isProd = environment === "production";

// Connection options based on the image patterns
const options = {
  autoIndex: !isProd,  // Ensures that Mongoose will automatically build indexes
  minPoolSize: db.minPoolSize,  // From the image (adjust if your config has these values)
  maxPoolSize: db.maxPoolSize,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

// Function to set run validators (pattern from image)
function setRunValidators() {
  return { runValidators: true };
}

mongoose.set("strictQuery", true);  // Enforcing strict query mode as seen in the image

// Mongoose plugins (from the image)
mongoose.plugin((schema) => {
  schema.pre("findOneAndUpdate", setRunValidators);
  schema.pre("updateMany", setRunValidators);
  schema.pre("updateOne", setRunValidators);
  schema.pre("update", setRunValidators);
});



// Connect to the database outside of any function
if (environment !== "test") {
  mongoose.connect(dbURI, options)
  .then(() => {
    Logger.info("Mongoose connection done!");

    // ⚙️ Optional: Log if indexes are auto-created
    if (!isProd) {
      Logger.info("🧱 autoIndex is enabled (development mode)");
    } else {
      Logger.info("🚫 autoIndex is disabled (production mode)");
    }
  })
  .catch((error) => {
    Logger.error("Unable to connect to DB: " + error);
    setTimeout(() => mongoose.connect(dbURI, options), 5000);  // Retry after 5 seconds
  })};

// Connection events (pattern from the image)
mongoose.connection.on("connected", () => {
  Logger.debug("Mongoose default connection open to " + dbURI);
});

mongoose.connection.on("error", (err) => {
  Logger.error("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected");
});

// If Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close().finally(() => {
    Logger.info("Mongoose default connection disconnected through app termination");
    process.exit(0);
  });
});

export const connection = mongoose.connection;