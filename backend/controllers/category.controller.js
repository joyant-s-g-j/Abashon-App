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

export const createCatgory = async (req, res) => {
    try {
        const { name } = req.body;

        if(!name) {
            return res.status(400).json({ success: false, message: "Category name is required" })
        }

        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if(existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" })
        }

        const category = await Category.create({ name })
        res.status(201).json({ success: true, data: category, message: "Category created successfully" })
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error", error: error.message})        
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid category Id" })
        }

        if(!name) {
            return res.status(400).json({ success: false, message: "Category name is required" })
        }

        const category = await Category.findById(id)
        if(!category) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id }
        })

        if(existingCategory) {
            return res.status(400).json({ success: false, message: "Category name already exists" })
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedCategory, message: "Category updated successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error", error: error.message})        
    }
}