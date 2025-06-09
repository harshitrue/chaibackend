import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validate the user details
    //check if user already exists
    //check for images, check for avatar
    //upload them to cloudinary
    //create user object - create entry in db
    //remove opassword and refresh token field from response
    // check for user creation
    //return res


    const {fullname,email,username,password }=req.body
    console.log("email:",email);
    
    if([fullname,email,username,password].some((field) => field?.trim() === "")
    ) {
        // if any of the fields are empty, throw an error
        throw new ApiError(400,"Please provide all the required fields")
    }
    
    // check if user already exists
    const existingUser = await User.findOne({
        $or: [
            {email: email},
            {username: username}
        ]
    })
    if(existingUser) {
        throw new ApiError(409, "User already exists with this email or username")
    }
    // check for images,check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Please provide avatar and cover image")
    }

    // upload images to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username:username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "User creation failed")
    }

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", createdUser)
    )



})



export {registerUser}
// export default registerUser