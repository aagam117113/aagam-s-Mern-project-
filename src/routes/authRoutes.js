import express from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

/**
 * These routes are prefixed with /api/auth in server.js
 * So /login becomes /api/auth/login
 * /signup becomes /api/auth/signup
 */

router.post("/register", register);
router.post("/signup", register); // Alias for frontend compatibility
router.post("/login", login);
router.post("/logout", logout);

export default router;
