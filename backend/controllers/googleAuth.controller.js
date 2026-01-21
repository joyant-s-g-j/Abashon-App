import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

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

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const payload = await verifyGoogleToken(idToken);
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    });

    if (user) {
      if (!user.googleId) {
        if (user.authMethod === "local") {
          return res.status(400).json({
            message:
              "This email is already registered with password. Please login with your password.",
          });
        }
        user.googleId = googleId;
        user.authMethod = "google";
      }

      user.name = name;
      user.avatar = picture || user.avatar;
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = new User({
        googleId,
        email,
        name,
        avatar: picture || "",
        authMethod: "google",
        isEmailVerified: true,
      });
      await user.save();
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      authMethod: user.authMethod,
      googleId: user.googleId,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in Google auth controller", error.message);
    if (error.message === "Invalid Google token") {
      res.status(400).json({ message: "Invalid Google token" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const googleAuthWithAccessToken = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Access token is required" });
    }

    const userResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!userResponse.ok) {
      return res.status(400).json({ message: "Invalid access token" });
    }

    const googleUser = await userResponse.json();
    const { id: googleId, email, name, picture, verified_email } = googleUser;

    let user = await User.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    });

    if (user) {
      if (!user.googleId) {
        if (user.authMethod === "local") {
          return res.status(400).json({
            message:
              "This email is already registered with password. Please login with your password.",
          });
        }
        user.googleId = googleId;
        user.authMethod = "google";
      }
      user.name = name;
      if (picture && !picture.includes("googleusercontent.com")) {
        user.avatar = picture;
      }
      user.isEmailVerified = verified_email || true;
      await user.save();
    } else {
      user = new User({
        googleId,
        email,
        name,
        phone: null,
        avatar:
          picture && !picture.includes("googleusercontent.com") ? picture : "",
        authMethod: "google",
        isEmailVerified: verified_email || true,
      });
      await user.save();
    }

    generateToken(user._id, res);
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: picture || user.avatar,
      authMethod: user.authMethod,
      googleId: user.googleId,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in Google auth with access token", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuthWithUserData = async (req, res) => {
  try {
    const { googleUser } = req.body;

    if (!googleUser || !googleUser.googleId || !googleUser.email) {
      return res.status(400).json({ message: "Google user data is required" });
    }

    const { googleId, email, name, picture, isEmailVerified } = googleUser;

    // Check if user already exists with this email
    let user = await User.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    });

    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        // Check if this email was registered with local auth
        if (user.authMethod === "local") {
          return res.status(400).json({
            message:
              "This email is already registered with password. Please login with your password.",
          });
        }

        user.googleId = googleId;
        user.authMethod = "google";
      }

      // Update user info from Google
      user.name = name;
      user.avatar = picture || user.avatar;
      user.isEmailVerified = isEmailVerified || true;
      await user.save();
    } else {
      // Create new user
      user = new User({
        googleId,
        email,
        name,
        avatar: picture || "",
        authMethod: "google",
        isEmailVerified: isEmailVerified || true,
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
      avatar: user.avatar,
      authMethod: user.authMethod,
      googleId: user.googleId,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
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
      return res
        .status(400)
        .json({ message: "Code and redirectUri are required" });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).json({
        message: "Failed to get access token from Google",
        details: tokenData.error_description || tokenData.error,
      });
    }

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    if (!userResponse.ok) {
      return res
        .status(400)
        .json({ message: "Failed to get user info from Google" });
    }

    const googleUser = await userResponse.json();
    const { id: googleId, email, name, picture, verified_email } = googleUser;

    // Find or create user
    let user = await User.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    });

    if (user) {
      if (!user.googleId) {
        if (user.authMethod === "local") {
          return res.status(400).json({
            message:
              "This email is already registered with password. Please login with your password.",
          });
        }
        user.googleId = googleId;
        user.authMethod = "google";
      }
      user.name = name;
      if (picture && !picture.includes("googleusercontent.com")) {
        user.avatar = picture;
      }
      user.isEmailVerified = verified_email || true;
      await user.save();
    } else {
      user = new User({
        googleId,
        email,
        name,
        phone: "", // Explicitly set empty string
        avatar:
          picture && !picture.includes("googleusercontent.com") ? picture : "",
        authMethod: "google",
        isEmailVerified: verified_email || true,
      });
      await user.save();
    }

    // Generate JWT token and get it for mobile response
    const jwtToken = generateToken(user._id, res, true); // Pass true to get token back

    // Send response with token included for mobile apps
    res.status(200).json({
      success: true,
      token: jwtToken, // Include token in response body for mobile
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: picture || user.avatar,
      authMethod: user.authMethod,
      googleId: user.googleId,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in Google auth with code:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: "Check server console for full error details",
    });
  }
};

export const updatePhoneNumber = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const existingUser = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number is already in use" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { phone },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Phone number updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authMethod: user.authMethod,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error updating phone number", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleOAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send(`
                <html>
                    <head><title>Error</title></head>
                    <body>
                        <h1>Authorization Error</h1>
                        <p>Authorization code is required</p>
                        <script>
                            window.location.href = 'com.abashon://auth-callback?error=Authorization%20code%20is%20required';
                        </script>
                    </body>
                </html>
            `);
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      const errorMsg = encodeURIComponent(
        tokenData.error_description || "Failed to get access token",
      );
      return res.send(`
                <html>
                    <head><title>Error</title></head>
                    <body>
                        <h1>Token Error</h1>
                        <p>${tokenData.error_description || "Failed to get access token"}</p>
                        <script>
                            window.location.href = 'com.abashon://auth-callback?error=${errorMsg}';
                        </script>
                    </body>
                </html>
            `);
    }

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    if (!userResponse.ok) {
      return res.send(`
                <html>
                    <head><title>Error</title></head>
                    <body>
                        <h1>User Info Error</h1>
                        <p>Failed to get user info</p>
                        <script>
                            window.location.href = 'com.abashon://auth-callback?error=Failed%20to%20get%20user%20info';
                        </script>
                    </body>
                </html>
            `);
    }

    const googleUser = await userResponse.json();
    const { id: googleId, email, name, picture, verified_email } = googleUser;

    // Find or create user
    let user = await User.findOne({
      $or: [{ email: email }, { googleId: googleId }],
    });

    if (user) {
      if (!user.googleId) {
        if (user.authMethod === "local") {
          const errorMsg = encodeURIComponent(
            "This email is already registered with password",
          );
          return res.send(`
                        <html>
                            <head><title>Error</title></head>
                            <body>
                                <h1>Email Already Registered</h1>
                                <p>This email is already registered with password</p>
                                <script>
                                    window.location.href = 'com.abashon://auth-callback?error=${errorMsg}';
                                </script>
                            </body>
                        </html>
                    `);
        }
        user.googleId = googleId;
        user.authMethod = "google";
      }
      user.name = name;
      if (picture && !picture.includes("googleusercontent.com")) {
        user.avatar = picture;
      }
      user.isEmailVerified = verified_email || true;
      await user.save();
    } else {
      user = new User({
        googleId,
        email,
        name,
        phone: "",
        avatar:
          picture && !picture.includes("googleusercontent.com") ? picture : "",
        authMethod: "google",
        isEmailVerified: verified_email || true,
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id, res, true);

    // Return HTML page that redirects to deep link
    const redirectUrl = `com.abashon://auth-callback?token=${encodeURIComponent(jwtToken)}&userId=${user._id}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&avatar=${encodeURIComponent(user.avatar || "")}&role=${user.role}`;

    return res.send(`
            <html>
                <head>
                    <title>Authentication Successful</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
                        .container { background: white; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
                        h1 { color: #333; margin: 0 0 10px 0; }
                        p { color: #666; margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✓ Signed In Successfully</h1>
                        <p>Redirecting to Abashon...</p>
                    </div>
                    <script>
                        // Redirect to deep link
                        window.location.href = '${redirectUrl}';
                        
                        // Fallback for WebView
                        setTimeout(() => {
                            if (typeof AndroidBridge !== 'undefined') {
                                AndroidBridge.handleDeepLink('${redirectUrl}');
                            }
                        }, 500);
                    </script>
                </body>
            </html>
        `);
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    const errorMsg = encodeURIComponent("Authentication failed");
    return res.send(`
            <html>
                <head><title>Error</title></head>
                <body>
                    <h1>Authentication Error</h1>
                    <p>${error.message}</p>
                    <script>
                        window.location.href = 'com.abashon://auth-callback?error=${errorMsg}';
                    </script>
                </body>
            </html>
        `);
  }
};
