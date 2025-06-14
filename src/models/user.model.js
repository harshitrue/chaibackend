import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new Schema(
    {
        username: {
            type: String,   
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,   //cloudinary url
            required: true
        },
        coverImage: {
            type: String,   
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String,
        },
} ,
    {timestamps: true }
)

//middleware just before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // Hash the password if it has been modified or is new
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({ _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
     }, process.env.ACCESS_TOKEN_SECRET, {
     
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
    return token;

};

userSchema.methods.generateRefreshToken = function () {
     const token = jwt.sign({ _id: this._id },
         process.env.REFRESH_TOKEN_SECRET, {
     
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
    return token;
}


export const User = mongoose.model("User", userSchema);