import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getActiveCall, getCallHistory, saveCallRecord, updateCallStatus } from "../controllers/call.controller.js"

const router = express.Router()

router.get("/history", protectRoute, getCallHistory);
router.get("/active", protectRoute, getActiveCall );
router.post("/record", protectRoute, saveCallRecord);
router.put("/status/:callId", protectRoute, updateCallStatus);

export default router;