const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const accountRoutes = require("./routes/accountRoutes"); 
const db = require("./config/db"); 

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/accounts", accountRoutes); 

// Test endpoint
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});