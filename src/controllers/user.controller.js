import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const generateAccessandRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token in the user's document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
        
    } catch (error) {
            throw new ApiError(500, "Internal Server Error");
            
        }
    };

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
    //console.log("email:",email);
    
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
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

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


const loginUser = asyncHandler(async (req, res) => {
    //req.body se data le aao
    //username or email se user ko dhundo
    //check if user exists
    //check if password is correct
    //access and refresh token generate karo
    //send cookie
    //return user details without password and refresh token
    const {email, username, password} = req.body;

    if(!email || !username) {
        throw new ApiError(400, "Please provide email or username")
    }

    const user = await User.findOne({
        $or: [{email}, {username}],
    })

    if(!user) {
        throw new ApiError(404, "User not found")
    }


    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    const {accessToken,refreshToken} = await generateAccessandRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select( "-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User logged in successfully", {
        user :accessToken, loggedInUser, refreshToken
    }
)
)
})

const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
            runValidators: true
        }
   )

   const options = {
    httpOnly: true,
    secure: true
   }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User logged out successfully"))
})



export {registerUser,loginUser,logoutUser}
