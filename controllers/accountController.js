const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware"); 
const db = require("../config/db"); 

// Signup function
const signup = async (req, res) => {
    try {
        const { fullname, username, password } = req.body;

        // Validate input
        if (!fullname || !username || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if the user already exists
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length > 0) {
            return res.status(400).json({ error: "User  already exists." });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with the hashed password
        await db.execute("INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)", [fullname, username, hashedPassword]);
        res.status(201).json({ message: "User  registered successfully." });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "An error occurred during signup." });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        // Check if the user exists
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const user = rows[0];

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Return success response with token
        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
};


const getAllAccounts = async (req, res) => {
  try {
      // Fetch all accounts
      const [rows] = await db.execute("SELECT id, fullname, username, created_at FROM users");
      res.status(200).json({ users: rows });
  } catch (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ error: "An error occurred while fetching accounts." });
  }
};

const getAccount = async (req, res) => {
  const { id } = req.params;

  try {
      // Query users table
      const sql = "SELECT * FROM users WHERE id = ?";
      const [results] = await db.query(sql, [id]);

      if (results.length === 0 || results[0].id !== req.user.id) {
          return res.status(404).json({ message: "Account not found or unauthorized" });
      }

      res.json(results[0]); // Return only the first account (assuming unique ID)
  } catch (err) {
      console.error("Error fetching account:", err);
      return res.status(500).json({ message: "Database error", error: err });
  }
};

// Update an account (assuming user can update their own account)
const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { username, avatar } = req.body;

  if (!username || !avatar) {
      return res.status(400).json({ error: "Username and avatar are required" });
  }

  try {
      const sql = "UPDATE users SET username = ?, avatar = ? WHERE id = ?";
      const [result] = await db.query(sql, [username, avatar, id]);

      if (result.affectedRows === 0 || result.affectedRows !== 1) {
          return res.status(404).json({ message: "Account not found" });
      }

      res.json({ message: "Account updated successfully" });
  } catch (err) {
      console.error("Error updating account:", err);
      return res.status(500).json({ message: "Database error", error: err });
  }
};


const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
      const sql = "DELETE FROM users WHERE id = ?";
      const [result] = await db.query(sql, [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Account not found" });
      }

      res.json({ message: "Account deleted successfully" });
  } catch (err) {
      console.error("Error deleting account:", err);
      return res.status(500).json({ message: "Database error", error: err });
  }
};

module.exports = {signup, login, getAllAccounts, getAccount, updateAccount, deleteAccount,};