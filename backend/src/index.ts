import express from "express";
import { Pool } from "pg";
import dutyRoutes from "./routes/dutyRoutes";
import { errorHandler } from "./middleware/errorHandler";
import pool from "./utils/db";

// Create an Express app function that takes in a database pool
const createApp = (pool: Pool) => {
  const app = express();

  // Middleware to handle CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });

  // Parse incoming JSON requests
  app.use(express.json());

  // Use duty routes and inject the pool into the routes
  app.use("/api", dutyRoutes(pool));

  // Error handling middleware
  app.use(errorHandler);

  return app;
};

export default createApp;

// Starting the server with the production database pool
if (require.main === module) {
  const app = createApp(pool);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
