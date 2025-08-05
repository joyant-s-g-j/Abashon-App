import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js"
import Facility from "../models/facility.model.js";

const uploadIconToCloudinary = async (iconData) => {
    try {
        const result = await cloudinary.uploader.upload(iconData, {
            folder: 'facilities/icons',
            resource_type: 'image',
            transformation: [
                { width: 64, height: 64, crop: 'fill', quality: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Icon upload failed: ${error.message}`);
    }
};

const deleteIconFromCloudinary = async (iconUrl) => {
    try {
        const publicId = iconUrl.split('/').pop().split('.')[0];
        const folderPath = iconUrl.includes('/facilities/icons/') ? 'facilities/icons/' + publicId : publicId;
        await cloudinary.uploader.destroy(folderPath)
    } catch (error) {
        console.error('Error deleting icon from Cloudinary:', error.message);
    }
}

export const getAllFacilites = async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: facilities })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const getAllFacilityById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid facility Id" })
        }

        const facility = await Facility.findById(id);

        if(!facility) {
            return res.status(404).json({ success: false, message: "Facility not found" })
        }

        res.status(200).json({ success: true, data: facility })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}