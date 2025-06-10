import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';
export const verifyJWT = asyncHandler(async (req, res, next) => {
try {
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer", "")
        //throw error if token is not present
        console.log("token:", token);
        if (!token) {
            throw new ApiError("You are not authenticated");
        }
    
        //verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select
        ("-password =refreshToken");
    
        if (!user) {
            throw new ApiError("User not found", 404);
        }
    
        req.user = user;
        next()
} catch (error) {
    throw new ApiError("You are not authenticated", 401);
    
}
})
