import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        throw new Error("Invalid Google token");
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if(!idToken) {
            return res.status(400).json({ message: 'ID token is required' });
        }

        const payload = await verifyGoogleToken(idToken);
        const {sub: googleId, email, name, picture} = payload

        let user = await User.findOne({
            $or: [
                {email: email},
                {googleId: googleId}
            ]
        })

        if(user) {
            if (!user.googleId) {
                if(user.authMethod === 'local') {
                    return res.status(400).json({
                        message: "This email is already registered with password. Please login with your password."
                    })
                }
                user.googleId = googleId;
                user.authMethod = 'google';
            }

            user.name = name;
            user.profilePic = picture || user.profilePic;
            user.isEmailVerified = true;
            await user.save();
        } else {
            user = new User({
                googleId,
                email,
                name,
                profilePic: picture || "",
                authMethod: 'google',
                isEmailVerified: true
            });
            await user.save()
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            authMethod: user.authMethod,
            googleId: user.googleId,
            isEmailVerified: user.isEmailVerified,
            role: user.role
        })
    } catch (error) {
        console.log("Error in Google auth controller", error.message);
        if (error.message === 'Invalid Google token') {
            res.status(400).json({ message: "Invalid Google token" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const googleAuthWithAccessToken = async (req, res) => {
    try {
        const { accessToken } = req.body;

        if(!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        const userResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userResponse.ok) {
            return res.status(400).json({ message: 'Invalid access token' });
        }

        const googleUser = await userResponse.json();
        const { id:googleId, email, name, picture, verified_email } = googleUser

        let user = await User.findOne({
            $or: [
                {email:email},
                {googleId: googleId}
            ]
        });

        if(user) {
            if(!user.googleId) {
                if (user.authMethod === 'local') {
                    return res.status(400).json({ 
                        message: "This email is already registered with password. Please login with your password." 
                    });
                }
                user.googleId = googleId;
                user.authMethod = 'google';
            }
            user.name = name; 
            if (picture && !picture.includes('googleusercontent.com')) {
                user.profilePic = picture;
            }
            user.isEmailVerified = verified_email || true;
            await user.save();
        } else {
            user = new User({
                googleId,
                email,
                name,
                // ✅ Fix: Set empty string for profilePic if URL is from Google
                profilePic: (picture && !picture.includes('googleusercontent.com')) ? picture : "",
                authMethod: 'google',
                isEmailVerified: verified_email || true
            });
            await user.save();
        }

        generateToken(user._id, res);
        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: picture || user.profilePic,
            authMethod: user.authMethod,
            googleId: user.googleId,
            isEmailVerified: user.isEmailVerified,
            role: user.role
        });
    } catch (error) {
        console.log("Error in Google auth with access token", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const googleAuthWithUserData = async (req, res) => {
    try {
        const { googleUser } = req.body;
        
        if (!googleUser || !googleUser.googleId || !googleUser.email) {
            return res.status(400).json({ message: 'Google user data is required' });
        }

        const { googleId, email, name, picture, isEmailVerified } = googleUser;

        // Check if user already exists with this email
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });
        
        if (user) {
            // If user exists but doesn't have googleId, update it
            if (!user.googleId) {
                // Check if this email was registered with local auth
                if (user.authMethod === 'local') {
                    return res.status(400).json({ 
                        message: "This email is already registered with password. Please login with your password." 
                    });
                }
                
                user.googleId = googleId;
                user.authMethod = 'google';
            }
            
            // Update user info from Google
            user.name = name;
            user.profilePic = picture || user.profilePic;
            user.isEmailVerified = isEmailVerified || true;
            await user.save();
        } else {
            // Create new user
            user = new User({
                googleId,
                email,
                name,
                profilePic: picture || "",
                authMethod: 'google',
                isEmailVerified: isEmailVerified || true
            });
            await user.save();
        }

        // Generate JWT token
        generateToken(user._id, res);

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            authMethod: user.authMethod,
            googleId: user.googleId,
            isEmailVerified: user.isEmailVerified,
            role: user.role
        });

    } catch (error) {
        console.log("Error in Google auth with user data", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const googleAuthWithCode = async (req, res) => {
    try {
        const { code, redirectUri } = req.body;

        if (!code || !redirectUri) {
            return res.status(400).json({ message: 'Code and redirectUri are required' });
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            return res.status(400).json({ 
                message: 'Failed to get access token from Google',
                details: tokenData.error_description || tokenData.error 
            });
        }
        
        // Reuse your existing access-token logic
        req.body.accessToken = tokenData.access_token;
        return googleAuthWithAccessToken(req, res);

    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message,
            details: 'Check server console for full error details'
        });
    }
};