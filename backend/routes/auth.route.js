import express from "express"
import { checkAuth, login, logout, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { googleAuth, googleAuthWithAccessToken, googleAuthWithCode, googleAuthWithUserData } from "../controllers/googleAuth.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/check", protectRoute, checkAuth)

router.post("/google", googleAuth)
router.post("/google/access-token", googleAuthWithAccessToken)
router.post("/google/user-data", googleAuthWithUserData)
router.post("/google/code", googleAuthWithCode);

export default router