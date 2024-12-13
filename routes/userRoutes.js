// routes/userRoutes.js  
const express = require("express");  
const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken");  
const pool = require("../db");  

const router = express.Router();  
const SECRET_KEY = process.env.JWT_SECRET; // Ensure this key is set in .env file  

// Sign-up a new user  
router.post("/signup", async (req, res) => {  
  const { fullname, username, password } = req.body;  

  if (!fullname || !username || !password) {  
    return res.status(400).json({ error: "All fields are required" });  
  }  

  try {  
    const hashedPassword = await bcrypt.hash(password, 10);  
    const sql = "INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)";  
    const [result] = await pool.execute(sql, [fullname, username, hashedPassword]);  

    res.status(201).json({ message: "User registered successfully" });  
  } catch (err) {  
    if (err.code === "ER_DUP_ENTRY") {  
      return res.status(409).json({ error: "Username already exists" });  
    }  
    console.error("Database error:", err);  
    res.status(500).json({ error: "Failed to register user" });  
  }  
});  

// Login a user  
router.post("/login", async (req, res) => {  
  const { username, password } = req.body;  

  if (!username || !password) {  
    return res.status(400).json({ error: "All fields are required" });  
  }  

  try {  
    const sql = "SELECT * FROM users WHERE username = ?";  
    const [results] = await pool.execute(sql, [username]);  

    if (results.length === 0) {  
      return res.status(404).json({ error: "User not found" });  
    }  

    const user = results[0];  
    const isValid = await bcrypt.compare(password, user.password);  

    if (!isValid) {  
      return res.status(401).json({ error: "Invalid credentials" });  
    }  

    const token = jwt.sign(  
      { id: user.id, username: user.username, fullname: user.fullname },  
      SECRET_KEY,  
      { expiresIn: "24h" }  
    );  

    res.json({ token, fullname: user.fullname, username: user.username });  
  } catch (error) {  
    console.error("Error during login:", error);  
    res.status(500).json({ error: "Internal server error" });  
  }  
});  

module.exports = router;