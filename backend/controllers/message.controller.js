import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"

const uploadToCloudinary = async(imageData, folder = 'messages', type = "image") => {
    try {
        const result = await cloudinary.uploader.upload(imageData, {
            folder: folder,
            resource_type: type,
            transformation: 
                type === "image" ? [{width: 800, height: 600, crop: 'fill', quality: 'auto'}]
                : undefined

        })
        return result.secure_url;
    } catch (error) {
        throw new Error(`${type} upload failed: ${error.message}`);
    }
}

export const getUsers = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUser = await User.find({_id: {$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUser)
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const message = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: userToChatId
                },
                {
                    senderId: userToChatId,
                    receiverId: myId
                }
            ]
        })

        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessages: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image, video } = req.body
        const { id:receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        let videoUrl;

        if (image) {
            imageUrl = await uploadToCloudinary(image, "messages/images", "image");
        }

        if (video) {
            videoUrl = await uploadToCloudinary(video, "messages/videos", "video");
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            video: videoUrl
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage", error.message)
        res.status(500).json({ error: "Internal server error "});
    }
}