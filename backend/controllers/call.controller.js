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

export const getActiveCall = async (req, res) => {
    try {
        const userId = req.user._id.toString()

        if(isUserInCall(userId)) {
            res.status(200).json({ hasActiveCall: true })
        } else {
            res.status(200).json({ hasActiveCall: false });
        }
    } catch (error) {
        console.error("Error in getActiveCall:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const saveCallRecord = async(req, res) => {
    try {
        const {
            callId,
            receiverId,
            duration = 0,
            status = 'completed',
            callType = 'audio'
        } = req.body

        const callerId = req.user._id

        const callRecord = new Call({
            callId,
            callerId,
            receiverId,
            duration,
            status,
            callType,
            createdAt: new Date()
        })

        await callRecord.save()

        res.status(201).json({ message: "Call record saved successfully", call: callRecord })
    } catch (error) {
        console.error("Error in saveCallRecord:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCallStatus = async (req, res) => {
    try {
        const { callId } = req.params;
        const { status, duration, endedAt } = req.body;
        const userId = req.user._id;

        const call = await Call.findOne({
            callId,
            $or: [
                { callerId: userId },
                { receiverId: userId }
            ]
        });

        if(!call) {
            return res.status(404).json({ message: "Call record not found" })
        }

        call.status = status || call.status;
        call.duration = duration || call.duration;
        call.endedAt = endedAt ? new Date(endedAt) : call.endedAt

        await call.save();

        res.status(200).json({ message: "Call status updated successfully", call })
    } catch (error) {
        console.error("Error in updateCallStatus:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}