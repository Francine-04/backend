const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const db = require("../config/db"); // Import the database pool

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const sql = "SELECT * FROM posts";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Create a new post
const createPost = async (req, res) => {
  const { img, caption } = req.body;

  if (!img || !caption) {
    return res.status(400).json({ error: "Image and caption are required" });
  }

  const sql = "INSERT INTO posts (user_id, img, caption) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(sql, [req.user.id, img, caption]);
    res.status(201).json({ message: "Post created successfully", postId: result.insertId });
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Update an existing post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { img, caption } = req.body;

  if (!img || !caption) {
    return res.status(400).json({ error: "Image and caption are required" });
  }

  const sql = "UPDATE posts SET img = ?, caption = ? WHERE id = ? AND user_id = ?";
  try {
    const [result] = await db.query(sql, [img, caption, id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM posts WHERE id = ? AND user_id = ?";
  try {
    const [result] = await db.query(sql, [id, req.user.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Database error", error: err });
  }
};

module.exports = { getAllPosts, createPost, updatePost, deletePost };