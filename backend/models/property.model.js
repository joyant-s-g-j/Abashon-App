import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    thumbnailImage: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    specifications: {
        bed: {
            type: String,
            required: true
        },
        bath: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    },
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility"
    }],
    galleryImages: {
        type: [String],
        default: []
    },
    location: {
        address: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isBooked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Property = mongoose.model("Property", propertySchema)

export default Property
