import { stripe } from "../lib/stripe.js"
import Booking from "../models/booking.model.js"

export const createCheckoutSession = async(req, res) => {
    try {
        const { property } = req.body

        if(!property || !property.id || !property.price || !property.name) {
            return res.status(400).json({ error: "Invalid property data"})
        }

        const amount = Math.round(property.price * 100)
        
        const lineItems = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: property.name,
                    images: property.thumbnailImage
                },
                unit_amount: amount
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.BASE_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/purchase-cancel`,
            metadata: {
                userId: req.user._id.toString(),
                properties: JSON.stringify(
                    properties.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }))
                )
            }
        })

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url
        })
    } catch (error) {
        console.log("Error processing checkout:", error)
        res.status(500).json({message: "Error processing checkout:", error: error.message})
    }
}

export const checkoutSuccess = async(req, res) => {
    try {
        const {sessionId} = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if(session.payment_status === "paid") {
            const existingBooking = await Booking.findOne({ stripSessionId: sessionId })

            if(existingBooking) {
                return res.status(200).json({
                    success: true,
                    message: "Booking already exists",
                    bookingId: existingBooking._id
                })
            }

            const newBooking = new Booking({
                user: session.metadata.userId,
                properties: [{
                    property: session.metadata.propertyId,
                    quantity: 1,
                    price: parseFloat(session.metadata.propertyPrice)
                }],
                totalAmount: session.amount_total / 100,
                stripSessionId: sessionId
            })

            await newBooking.save()
            res.status(200).json({ success: true, message: "Payment Successfull, booking created", bookingId: newBooking._id })
        } else {
            res.status(400).json({ success: false, message: "Payment not completed" })
        }
    } catch (error) {
        console.log("Error processing successful checkout:", error)
        res.status(500).json({message: "Error processing successful checkout:", error: error.message})
    }
}