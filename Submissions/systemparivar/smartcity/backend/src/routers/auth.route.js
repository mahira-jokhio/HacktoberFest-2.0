import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  getProfile
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, checkAuth);
router.get("/profile", protectRoute, getProfile);
router.put("/update-profile", protectRoute, updateProfile);

export default router;
