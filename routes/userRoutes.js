const express = require("express");  
const bcrypt = require("bcryptjs");  
const jwt = require("jsonwebtoken");  
const db = require("../db");  

const router = express.Router();  
const SECRET_KEY = process.env.JWT_SECRET;  

// Sign-up a new user  
router.post("/signup", async (req, res) => {  
  const { fullname, username, password } = req.body;  

  if (!fullname || !username || !password) {  
    return res.status(400).json({ error: "All fields are required" });  
  }  

  try {  
    const hashedPassword = await bcrypt.hash(password, 10);  
    const query = "INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)";  

    db.query(query, [fullname, username, hashedPassword], (err, result) => {  
      if (err) {  
        if (err.code === "ER_DUP_ENTRY") {  
          return res.status(409).json({ error: "Username already exists" });  
        }  
        console.error("Database error:", err);  
        return res.status(500).json({ error: "Failed to register user" });  
      }  
      res.status(201).json({ message: "User registered successfully" });  
    });  
  } catch (error) {  
    console.error("Error during signup:", error);  
    res.status(500).json({ error: "Internal server error" });  
  }  
});  

// Login a user  
router.post("/login", async (req, res) => {  
  const { username, password } = req.body;  

  if (!username || !password) {  
    return res.status(400).json({ error: "All fields are required" });  
  }  

  try {  
    const query = "SELECT * FROM users WHERE username = ?";  
    db.query(query, [username], async (err, results) => {  
      if (err) {  
        console.error("Database error:", err);  
        return res.status(500).json({ error: "Login failed" });  
      }  
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
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME } // Use environment variable  
      );  

      res.json({ token, fullname: user.fullname, username: user.username });  
    });  
  } catch (error) {  
    console.error("Error during login:", error);  
    res.status(500).json({ error: "Internal server error" });  
  }  
});  

module.exports = router;