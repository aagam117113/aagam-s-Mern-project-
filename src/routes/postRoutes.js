import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * These routes are prefixed with /api/posts in server.js
 * So / becomes /api/posts
 * /:id becomes /api/posts/:id
 */

router.route("/").get(getPosts).post(protect, createPost);
router.route("/:id").get(getPost).put(protect, updatePost).delete(protect, deletePost);

export default router;
