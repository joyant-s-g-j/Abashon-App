import mongoose from 'mongoose'
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    phone: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId
        },
        minlength: [6, "Password must be at least 6 characters long"]
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePic: {
        type: String,
        // enum: ['local', 'google'],
        default: ''
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    favProperties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property"
        }
    ],
    role: {
        type: String,
        enum: ["customer", "agent", "admin"],
        default: "customer"
    }
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password") || this.authMethod === 'google') return next()

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    if (this.authMethod === 'google') {
        throw new Error('Cannot compare password for Google authenticated users');
    }
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

export default User