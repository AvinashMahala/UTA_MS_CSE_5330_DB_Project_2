import app from "./app";
import env from "./util/validateenv";

// Get the database connection pool from app.ts
const app_pool = app;

// Start the express server listening on the specified port
app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
