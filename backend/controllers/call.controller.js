import Call from "../models/call.model.js";

export const getCallHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 20 } = req.query;

        const calls = await Call.find({
            $or: [
                { callerId: userId },
                { receiverId: userId }
            ]
        })
        .populate('callerId', 'name avatar')
        .populate('receiverId', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

        const totalCalls = await Call.countDocuments({
            $or: [
                { callerId: userId },
                { receiverId: userId }
            ]
        });

        res.status(200).json({
            calls,
            totalPages: Math.ceil(totalCalls / limit),
            currentPage: page,
            totalCalls
        })
    } catch (error) {
        console.error("Error in getCallHistory:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}