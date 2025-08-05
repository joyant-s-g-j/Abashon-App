import express from "express";
import { createCatgory, deleteCategory, getallCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";

const router = express.Router()

router.get("/", getallCategories)
router.get("/:id", getCategoryById)
router.post("/", createCatgory)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router