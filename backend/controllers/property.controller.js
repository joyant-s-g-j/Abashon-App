import mongoose from "mongoose"
import Property from "../models/property.model.js"

export const getAllProperties = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            type,
            minPrice,
            maxPrice,
            bed,
            bath,
            isFeatured,
            owner,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query
        
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
            if(maxPrice) query.price.$gte = Number(maxPrice)
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
        const {
            name,
            thumnailImage,
            type,
            specifications,
            owner,
            description,
            facilities,
            galleryImages,
            location,
            price,
            isFeatured
        } = req.body;

        if( !name || !thumnailImage || !specifications || !description || !location || !price) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        if(!location.latitude || !location.longtitude || !location.addess) {
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

        const property = await Property.create({
            name,
            thumnailImage,
            type,
            specifications,
            owner,
            description,
            facilities,
            galleryImages: galleryImages || [],
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

        const updatedProperty = await Property.findByIdAndUpdate( id, req.body, { new: true, runValidators: true })
            .populate('type', 'name')
            .populate('owner', 'name email')
            .populate('facilities', 'name');
        
        res.status(200).json({ success: true, data: updatedProperty, message: "Property updated successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message })        
    }
}

