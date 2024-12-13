const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {getAllPosts, createPost, updatePost, deletePost} = require ("../controllers/postContoller");

const router = express.Router();

router.get("/", authenticateToken, getAllPosts);
router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

module.exports = router;
