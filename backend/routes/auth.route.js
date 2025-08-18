import express from "express"
import { checkAuth, getAllUsers, getProfile, login, logout, signup, updateProfile } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { googleAuth, googleAuthWithAccessToken, googleAuthWithCode, googleAuthWithUserData, updatePhoneNumber } from "../controllers/googleAuth.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/check", protectRoute, checkAuth)
router.get("/profile", protectRoute, getProfile)
router.put("/update-profile", protectRoute, updateProfile)
router.get("/users", getAllUsers)

router.put("/update-phone", protectRoute, updatePhoneNumber);
router.post("/google", googleAuth)
router.post("/google/access-token", googleAuthWithAccessToken)
router.post("/google/user-data", googleAuthWithUserData)
router.post("/google/code", googleAuthWithCode);

export default router