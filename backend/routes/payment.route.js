import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js"
import Booking from "../models/booking.model.js"


const router = express.Router()

router.post("/create-checkout-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)

router.get("/my-bookings", protectRoute, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('properties.property', 'name thumbnailImage location price')
            .sort({ createdAt: -1 })
        
        res.status(200).json({ success: true, bookings })
    } catch (error) {
        console.log("Error fetching bookings", error)
        res.status(500).json({ message: "Error fetching bookings", error: error.message })
    }
})

export default router