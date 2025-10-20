import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router()

router.use(isAuthenticated)

router.get("/me", getUser)


export default router