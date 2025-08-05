import mongoose from "mongoose";
import Category from "../models/category.model.js"

export const getallCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({name: 1});
        res.status(200).json({ success: true, data: categories })
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error", error: error.message })
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid category Id"})
        }

        const category = await Category.findById(id);

        if(!category) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }
        res.status(200).json({ success: true, data: category })
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error", error: error.message})
    }
}