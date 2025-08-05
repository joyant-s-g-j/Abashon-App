import mongoose from "mongoose"
import Property from "../models/property.model.js"
import cloudinary from "../lib/cloudinary.js"

const uploadToCloudinary = async(imageData, folder = 'properties') => {
    try {
        const result = await cloudinary.uploader.upload(imageData, {
            folder: folder,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 600, crop: 'fill', quality: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
}

const deleteFromCloudinary = async (imageUrl) => {
    try {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        const folderPath = imageUrl.includes('/properties') ? 'properties/' + publicId : publicId;
        await cloudinary.uploader.destroy(folderPath);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error.message);
    }
}

export const getAllProperties = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type, minPrice, maxPrice, bed, bath, isFeatured, owner, sortBy = 'createdAt', sortOrder = 'desc' } = req.query
        
        const query = {}
        
        if(search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        if(type) {
            query.type = type
        }

        if(minPrice || maxPrice) {
            query.price = {}
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)
        }

        if(bed) query['specifications.bed'] = bed;
        if(bath) query['specifications.bath'] = bath;

        if(isFeatured !== undefined) {
            query.isFeatured = isFeatured === 'true';
        }

        if(owner) {
            query.owner = owner;
        }

        const skip = (page - 1) * limit;

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const properties = await Property.find(query)
            .populate('type', 'name')
            .populate('owner', 'name email')
            .populate('facilities', 'name')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Property.countDocuments(query);

        res.status(200).json({
            success: true,
            data: properties,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid property Id"
            });
        }

        const property = await Property.findById(id)
            .populate('type', 'name description')
            .populate('owner', 'name email phone')
            .populate('facilities', 'name description')
            .populate('ratings.user', 'name');
        
        if(!property) {
            return res.status(404).json({ success: false, message: "Property not found" })
        }
        
        res.status(200).json({ success: true, data: property })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })
    }
}

export const createProperty = async (req, res) => {
    try {
        const { name, thumnailImage, type, specifications, owner, description, facilities, galleryImages, location, price, isFeatured } = req.body;

        if( !name || !thumnailImage || !specifications || !description || !location || !price) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        if(!location.latitude || !location.longtitude || !location.address) {
            return res.status(400).json({ success: false, message: "Please provide complete location information"})
        }

        if(!specifications.bed || !specifications.bath || !specifications.area) {
            return res.status(400).json({ success: false, message: "Please provide all specifications (bed, bath, area)"})
        }

        if(type && !mongoose.Types.ObjectId.isValid(type)) {
            return res.status(400).json({ success: false, message: "Invalid category Id"})
        }

        if(owner && !mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ success: false, message: "Invalid owner Id"})
        }

        if(facilities && !mongoose.Types.ObjectId.isValid(facilities)) {
            return res.status(400).json({ success: false, message: "Invalid facility Id"})
        }

        let uploadedThumbnail;
        try {
            uploadedThumbnail = await uploadToCloudinary(thumnailImage, 'properties/thumbnails')
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let uploadedGalleryImages = [];
        if(galleryImages && galleryImages.length > 0) {
            try {
                const uploadPromises = galleryImages.map(image => uploadToCloudinary(image, 'properties/gallery'));
                uploadedGalleryImages = await Promise.all(uploadPromises);
            } catch (error) {
                await deleteFromCloudinary(uploadedThumbnail)
                return res.status(400).json({ success: false, message: `Gallery upload failed: ${error.message}` })
            }
        }

        const property = await Property.create({
            name,
            thumnailImage: uploadedThumbnail,
            type,
            specifications,
            owner,
            description,
            facilities,
            galleryImages: uploadedGalleryImages,
            location,
            price,
            isFeatured: isFeatured || false
        })

        const populatedProperty = await Property.findById(property._id)
            .populate('type', 'name')
            .populate('owner', 'name email')
            .populate('facilities', 'name');
        
        res.status(201).json({ success: true, data: populatedProperty, message: "Property created successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })        
    }
}

export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid property Id" })
        }

        const property = await Property.findById(id);

        if(!property) {
            return res.status(400).json({ success: false, message: "Property not found" })
        }

        const updateData = { ...req.body };

        if(req.body.thumnailImage && req.body.thumnailImage !== property.thumnailImage) {
            try {
                const newThumnail = await uploadToCloudinary(req.body.thumnailImage, 'properties/thumbnails')

                if(property.thumnailImage) {
                    await deleteFromCloudinary(property.thumnailImage)
                }
                updateData.thumnailImage = newThumnail
            } catch (error) {
                return res.status(400).json({ success: false, message: `Thumbnail update failed: ${error.message}` });
            }
        }

        if(req.body.galleryImages && Array.isArray(req.body.galleryImages)) {
            try {
                const uploadPromises = req.body.galleryImages.map(image => uploadToCloudinary(image, 'properties/gallery'))
                const newGalleryImages = await Promise.all(uploadPromises)

                if(property.galleryImages && property.galleryImages.length > 0) {
                    const deletePromises = property.galleryImages.map(imageUrl => deleteFromCloudinary(imageUrl));
                    await Promise.all(deletePromises)
                }

                updateData.galleryImages = newGalleryImages
            } catch (error) {
                return res.status(400).json({ success: false, message: `Gallery update failed: ${error.message}` });
            }
        }

        const updatedProperty = await Property.findByIdAndUpdate( id, req.body, { new: true, runValidators: true })
            .populate('type', 'name')
            .populate('owner', 'name email')
            .populate('facilities', 'name');
        
        res.status(200).json({ success: true, data: updatedProperty, message: "Property updated successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })        
    }
}

export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Property Id" })
        }

        const property = await Property.findById(id);

        if(!property) {
            return res.status(404).json({ success: false, message: "Property not found" })
        }

        if(property.thumnailImage) {
            await deleteFromCloudinary(property.thumnailImage)
        }

        if(property.galleryImages && property.galleryImages.length > 0) {
            const deletePromises = property.galleryImages.map(imageUrl => deleteFromCloudinary(imageUrl))
            await Promise.all(deletePromises)
        }
        
        await Property.findByIdAndDelete(id)

        res.status(200).json({ success: true, message: "Property deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })                
    }
}
