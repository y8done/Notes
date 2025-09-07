const express = require("express");
const userRouter = require('./routes/UserRoutes')
const notesRouter = require("./routes/NotesRoutes");
const aiRouter = require("./routes/AIRoutes");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const rateLimiter = require("./middleware/rateLimiter");
const cors = require('cors');
const path = require("path");
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

// Middleware
app.use(express.json());
app.use(cors()); // <-- Move this line here!
app.use(rateLimiter);
app.use("/api/notes", notesRouter);
app.use("/api/user", userRouter);
app.use("/api/ai", aiRouter);
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(distPath)); // Serve static files first

  // Catch-all route AFTER static
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
  });
});