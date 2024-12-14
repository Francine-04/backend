const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware"); 
const db = require("../config/db"); 

// Get all accounts (consider permission checks if needed)
const getAllAccounts = async (req, res) => {
  try {
    const sql = "SELECT * FROM accounts"; 
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Get a specific account (assuming user can access their own account)
const getAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "SELECT * FROM accounts WHERE id = ?";
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
    const sql = "UPDATE accounts SET username = ?, avatar = ? WHERE id = ?";
    const [result] = await db.query(sql, [username, avatar, id]);

    if (result.affectedRows === 0 || result.affectedRows !== 1) {
      // Check for both affected rows (update might fail due to other reasons)
      return res.status(404).json({ message: "Account not found or unauthorized" });
    }

    res.json({ message: "Account updated successfully" });
  } catch (err) {
    console.error("Error updating account:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete an account (assuming user can delete their own account)
const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM accounts WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Account not found or unauthorized" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

module.exports = {getAllAccounts, getAccount, updateAccount, deleteAccount,};