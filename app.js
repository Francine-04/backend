require("dotenv").config();  
const express = require("express");  
const cors = require("cors");  
const bodyParser = require("body-parser"); /
const db = require("./db"); 
const userRoutes = require("./routes/userRoutes");  
const postRoutes = require("./routes/postRoutes");  

const app = express();  

// Middleware  
app.use(cors()); // Enable CORS for all routes  
// Using Express's built-in JSON middleware instead of body-parser  
app.use(express.json());   

// Routes  
app.use("/api/users", userRoutes);  
app.use("/api/posts", postRoutes);  

// Test endpoint  
app.get("/", (req, res) => {  
  res.send("API is running!");  
});  

// Start server  
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`);  
});