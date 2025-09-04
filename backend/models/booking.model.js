import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        properties: [
            {
                property: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Property",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        stripSessionId: {
            type: String,
            unique: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'cancelled'],
            default: 'pending'
        }
    },
    { timestamps: true }
)

bookingSchema.index({ user: 1, stripSessionId: 1 })

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking