import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCLoudinary} from '../utils/cloudinary.service.js'
import {ApiResponse} from '../utils/ApiResponse.js'


const registerUser = asyncHandler(async (req,res)=>{
//get user detail from frontend
//validation -notnull
//check if user already exist or not
//check for images or avatar
//upload them on cludinary

// create user object and make entry in db
//remove password and refeersh token field from  response
//check for user creation
//return res
const{
fullname,email,username,password
} = req.body 
console.log("email: ",email)

// if(fullname===""){
//     throw new ApiError(400,"Full name is required")
// }

if(
    [fullname,email,username,password].some((f)=>f?.trim()===""
    ))
    {
        throw new ApiError(400,"All fields are required")
    }

const existedUser=User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    throw new ApiError(409,"User with duplicate username or email ! ")
}


const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required")
}

const avatar = await uploadOnCLoudinary(avatarLocalPath)
const coverImage = await uploadOnCLoudinary(coverImage)

if (!avatar) {
    throw new ApiError(400,"Avatar is required")
}


const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser =await User.findById(user._id).select(
    "password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
)


    res.status(200).json({
        message:"Jai Shri RAM"
    })
})




export {registerUser}