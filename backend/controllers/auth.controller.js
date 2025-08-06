import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const {name, email, phone, password} = req.body
    try {
        if(!name || !email || !phone || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        const user = await User.findOne({email})

        if (user) return res.status(400).json({message: "Email already exists"});

        const newUser = new User({
            name,
            email,
            phone,
            password,
            authMethod: 'local'
        })

        if(newUser) {
            await newUser.save();
            generateToken(newUser._id,res);
            
            res.status(201).json({
                _id:newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                profilePic: newUser.profilePic,
                authMethod: newUser.authMethod
            })
        } else {
            res.status(400).json({message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.authMethod === 'google') {
            return res.status(400).json({ 
                message: "This email is associated with Google sign-in. Please use Google to login." 
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            authMethod: user.authMethod
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            profilePic: req.user.profilePic,
            authMethod: req.user.authMethod,
            googleId: req.user.googleId,
            isEmailVerified: req.user.isEmailVerified
        })
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal server error"})
    }
}

const uploadImageToCloudinary = async(imageData) => {
    try {
        const result = await cloudinary.uploader.upload(imageData, {
            folder: 'users/profilePics',
            resource_type: 'image',
            transformation: [
                { width: 256, height: 256, crop: 'fill', quality: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
}

const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        const parts = imageUrl.split('/');
        const filename = parts.pop();
        const publicId = `users/profilePics/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error.message);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, phone, role, profilePic } = req.body;

        if(!name || !email || !phone) {
            return res.status(400).json({ success: false, message: "Name, email and phone are required" })
        }

        if(role && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update role' })
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        
        user.name = name;
        user.email = email;
        user.phone = phone;

        if(role) {
            user.role = role
        }

        if(profilePic) {
            if(profilePic.startsWith('data:')) {
                const newImageUrl = await uploadImageToCloudinary(profilePic)

                if(user.profilePic && !user.profilePic.includes('googleusercontent.com')) {
                    await deleteImageFromCloudinary(user.profilePic)
                }
                user.profilePic = newImageUrl;
            } else if (profilePic !== user.profilePic) {
                if(user.profilePic && !user.profilePic.includes('googleusercontent.com')) {
                    await deleteImageFromCloudinary(user.profilePic)
                }
                user.profilePic = profilePic;
            }
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profilePic: user.profilePic,
                authMethod: user.authMethod,
            }
        })
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}