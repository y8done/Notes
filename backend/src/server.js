const express = require("express");
const notesRouter = require("./routes/NotesRoutes");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const rateLimiter = require("./middleware/rateLimiter");
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to database

// Middleware
app.use(express.json());
app.use(cors()); // <-- Move this line here!
app.use(rateLimiter);
app.use("/api/notes", notesRouter);

// Start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
  });
});