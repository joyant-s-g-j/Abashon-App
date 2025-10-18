import mongoose from "mongoose"

const callSchema = new mongoose.Schema(
    {
        callId: {
            type: String,
            required: true,
            unique: true
        },
        callerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        callType: {
            type: String,
            enum: ["audio", "video"],
            default: "audio"
        },
        status: {
            type: String,
            enum: ["initiated", "ringing", "accepted", "rejected", "missed", "completed", "failed"],
            default: "initiated"
        },
        duration: {
            type: Number,
            default: 0
        },
        startedAt: {
            type: Date,
            default: null
        },
        endedAt: {
            type: Date,
            default: null
        },
        quality: {
            type: String,
            enum: ["excellent", "good", "fair", "poor"],
            default: null
        },
        metadata: {
            userAgent: String,
            platform: String,
            networkType: String
        }
    },
    { timestamps: true }
);

callSchema.index({ callerId: 1, createdAt: -1 });
callSchema.index({ receiverId: 1, createdAt: -1 });

callSchema.virtual('actualDuration').get(function() {
    if(this.startedAt && this.endedAt) {
        return Math.floor((this.endedAt = this.startedAt) / 1000)
    }
    return this.duration
})

callSchema.methods.getFormattedDuration = function() {
    const duration = this.actualDuration || this.duration;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    if(hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

callSchema.statics.getUserCallStats = async function(userId) {
    const stats = await this.aggregate([
        {
            $match: {
                $or: [{ callerId: userId }, { receiverId: userId }],
                status: 'completed'
            }
        },
        {
            $group: {
                _id: null,
                totalCalls: { $sum: 1 },
                totalDuration: { $sum: '$duration' },
                avgDuration: { $avg: '$duration' }
            }
        }
    ]);

    return stats[0] || { totalCalls: 0, totalDuration: 0, avgDuration: 0}
}

const Call = mongoose.model("Call", callSchema)

export default Call