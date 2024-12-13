const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Get all posts
router.get("/", authenticateToken, (req, res) => {
  const query = "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC";
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch posts" });
    res.json(results);
  });
});

// Add a post
router.post("/", authenticateToken, (req, res) => {
  const { img, caption } = req.body;
  const userId = req.user.id;

  const query = "INSERT INTO posts (user_id, img, caption) VALUES (?, ?, ?)";
  db.query(query, [userId, img, caption], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to create post" });
    res.status(201).json({ id: result.insertId, userId, img, caption });
  });
});

// Update a post
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { img, caption } = req.body;

  const query = "UPDATE posts SET img = ?, caption = ? WHERE id = ?";
  db.query(query, [img, caption, id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update post" });
    res.json({ message: "Post updated successfully" });
  });
});

// Delete a post
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM posts WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete post" });
    res.json({ message: "Post deleted successfully" });
  });
});

module.exports = router;