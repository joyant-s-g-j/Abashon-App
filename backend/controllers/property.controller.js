import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Property from "../models/property.model.js";

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
        if(!imageUrl || typeof imageUrl !== 'string') return
        const urlParts = imageUrl.split('/')
        const uploadIndex = urlParts.indexOf('upload')
        if(uploadIndex === -1) return
        const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/')
        const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');
        const result = await cloudinary.uploader.destroy(publicId)
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error.message);
        console.error('Image URL:', imageUrl);
    }
}

const isCloudinaryUrl = (url) => {
    return url && typeof url === 'string' && url.includes('cloudinary.com')
}

const needsUpload = (imageData) => {
    return imageData &&
        typeof imageData === 'string' &&
        (imageData.startsWith('data:image/') || imageData.startsWith('file://'))
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
            .populate('facilities', 'name icon')
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
            .populate('facilities', 'name icon')
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
        const { name, thumbnailImage, type, specifications, owner, description, facilities, galleryImages, location, price, isFeatured, isBooked } = req.body;

        if( !name || !thumbnailImage || !specifications || !description || !location || !price) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        if(!location.latitude || !location.longitude || !location.address) {
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

        if(facilities && Array.isArray(facilities)) {
            for(let i = 0; i < facilities.length; i++) {
                const facilityId = facilities[i];
                
                if(!mongoose.Types.ObjectId.isValid(facilityId)) {
                    console.log(`Invalid facility ID at index ${i}: ${facilityId}`);
                    return res.status(400).json({ 
                        success: false, 
                        message: `Invalid facility Id at index ${i}: ${facilityId}` 
                    });
                }
            }
        } else if(facilities && !Array.isArray(facilities)){
            return res.status(400).json({ 
                success: false, 
                message: "Facilities must be an array of facility IDs" 
            });
        }

        let uploadedThumbnail;
        try {
            uploadedThumbnail = await uploadToCloudinary(thumbnailImage, 'properties/thumbnails')
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        let uploadedGalleryImages = [];
        if(galleryImages && Array.isArray(galleryImages) && galleryImages.length > 0) {
            try {
                const validImages = galleryImages.filter(image => 
                    image && typeof image === 'string' &&
                    image.trim() !== '' &&
                    (image.startsWith('data:image/') || image.startsWith('file://') || image.startsWith('http'))
                )
                if(validImages.length > 0) {
                    const uploadPromises = validImages.map((image, index) => {
                        return uploadToCloudinary(image, 'properties/gallery')
                    })
                    uploadedGalleryImages = await Promise.all(uploadPromises);
                } else {
                    console.log('No valid gallery images to upload');
                }
            } catch (error) {
                await deleteFromCloudinary(uploadedThumbnail)
                return res.status(400).json({ success: false, message: `Gallery upload failed: ${error.message}` })
            }
        }

        const property = await Property.create({
            name,
            thumbnailImage: uploadedThumbnail,
            type,
            specifications,
            owner,
            description,
            facilities: facilities || [],
            galleryImages: uploadedGalleryImages,
            location,
            price,
            isFeatured: isFeatured || false,
            isBooked: isBooked || false
        })

        const populatedProperty = await Property.findById(property._id)
            .populate('type', 'name')
            .populate('owner', 'name email')
            .populate('facilities', 'name icon');
        
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

        if(req.body.facilities && Array.isArray(req.body.facilities)) {
            
            for(let i = 0; i < req.body.facilities.length; i++) {
                const facilityId = req.body.facilities[i];
                if(!mongoose.Types.ObjectId.isValid(facilityId)) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Invalid facility Id at index ${i}: ${facilityId}` 
                    });
                }
            }
        }

        if(req.body.thumbnailImage) {
            if(req.body.thumbnailImage === property.thumbnailImage) {
                delete updateData.thumbnailImage
            } else if(needsUpload(req.body.thumbnailImage)) {
                try {
                    const newThumnail = await uploadToCloudinary(req.body.thumbnailImage, 'properties/thumbnails')

                    if(property.thumbnailImage && isCloudinaryUrl(property.thumbnailImage)) {
                        await deleteFromCloudinary(property.thumbnailImage)
                    }
                    updateData.thumbnailImage = newThumnail
                } catch (error) {
                    return res.status(400).json({ success: false, message: `Thumbnail update failed: ${error.message}` });
                }
            } else if(isCloudinaryUrl(req.body.thumbnailImage)) {
                updateData.thumbnailImage = req.body.thumbnailImage
            }
        }

        if(req.body.galleryImages && Array.isArray(req.body.galleryImages)) {
            try {
                const existingCloudinaryImages = [];
                const imagesToUpload = [];

                req.body.galleryImages.forEach(image => {
                    if(image && typeof image === 'string') {
                        if(isCloudinaryUrl(image)) {
                            existingCloudinaryImages.push(image)
                        } else if(needsUpload(image)) {
                            imagesToUpload.push(image)
                        }
                    }
                })

                let newUploadedImages = [];
                if(imagesToUpload.length > 0) {
                    const uploadPromises = imagesToUpload.map(image => uploadToCloudinary(image, 'properties/gallery'));
                    newUploadedImages = await Promise.all(uploadPromises);
                    console.log('Successfully uploaded new gallery images:', newUploadedImages.length);
                }
                const finalGalleryImages = [...existingCloudinaryImages, ...newUploadedImages];
                
                if(property.galleryImages && property.galleryImages.length > 0) {
                    const imagesToDelete = property.galleryImages.filter(oldImage => 
                        !finalGalleryImages.includes(oldImage)
                    );
                    
                    if(imagesToDelete.length > 0) {
                        console.log('Deleting removed gallery images:', imagesToDelete.length);
                        const deletePromises = imagesToDelete.map(imageUrl => deleteFromCloudinary(imageUrl));
                        await Promise.all(deletePromises);
                    }
                }

                updateData.galleryImages = finalGalleryImages;
            } catch (error) {
                return res.status(400).json({ success: false, message: `Gallery update failed: ${error.message}` });
            }
        }

        const updatedProperty = await Property.findByIdAndUpdate( id, updateData, { new: true, runValidators: true })
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

        if(property.thumbnailImage && isCloudinaryUrl(property.thumbnailImage)) {
            await deleteFromCloudinary(property.thumbnailImage)
        }

        if(property.galleryImages && Array.isArray(property.galleryImages) && property.galleryImages.length > 0) {
            const deletePromises = property.galleryImages
                .filter(imageUrl => isCloudinaryUrl(imageUrl))
                .map(imageUrl => deleteFromCloudinary(imageUrl))
            
            if(deletePromises.length > 0) {
                await Promise.all(deletePromises)
            }
        }
        
        await Property.findByIdAndDelete(id)

        res.status(200).json({ success: true, message: "Property deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })                
    }
}
