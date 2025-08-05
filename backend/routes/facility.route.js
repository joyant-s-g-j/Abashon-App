import express from "express";
import { createFacility, deleteFacility, getAllFacilites, getFacilityById, updateFacility } from "../controllers/facility.controller.js";

const router = express.Router();

router.get("/", getAllFacilites);
router.get("/:id", getFacilityById);
router.post("/", createFacility);
router.put("/:id", updateFacility);
router.delete("/:id", deleteFacility)

export default router;