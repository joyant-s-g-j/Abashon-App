import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: [true, "Icon is required"]
    }
}, {timestamps: true})

const Facility = mongoose.model("Facility", facilitySchema)

export default Facility