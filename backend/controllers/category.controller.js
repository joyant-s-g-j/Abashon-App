import Category from "../models/category.model.js"

export const getallCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({name: 1});
        res.status(200).json({ success: true, data: categories })
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error", error: error.message })
    }
}