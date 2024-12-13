const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../config/db");

// Get all posts
const getAllPosts = (req, res) => {
  const sql = "SELECT * FROM posts";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
};

// Create a new post
const createPost = (req, res) => {
  const { img, caption } = req.body;

  if (!img || !caption) {
    return res.status(400).json({ error: "Image and caption are required" });
  }

  const sql = "INSERT INTO posts (user_id, img, caption) VALUES (?, ?, ?)";
  db.query(sql, [req.user.id, img, caption], (err, result) => {
    if (err) {
      console.error("Error creating post:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Post created successfully", postId: result.insertId });
  });
};

// Update an existing postS
const updatePost = (req, res) => {
  const { id } = req.params;
  const { img, caption } = req.body;

  if (!img || !caption) {
    return res.status(400).json({ error: "Image and caption are required" });
  }

  const sql = "UPDATE posts SET img = ?, caption = ? WHERE id = ? AND user_id = ?";
  db.query(sql, [img, caption, id, req.user.id], (err, result) => {
    if (err) {
      console.error("Error updating post:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.json({ message: "Post updated successfully" });
  });
};

// Delete a post
const deletePost = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM posts WHERE id = ? AND user_id = ?";
  db.query(sql, [id, req.user.id], (err, result) => {
    if (err) {
      console.error("Error deleting post:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.json({ message: "Post deleted successfully" });
  });
};

module.exports = {getAllPosts, createPost, updatePost, deletePost};