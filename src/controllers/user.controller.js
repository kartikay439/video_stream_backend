import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCLoudinary} from '../utils/cloudinary.service.js'
import {ApiResponse} from '../utils/ApiResponse.js'


const generateAccessAndRefreshTokens = async (UserId) => {
    try {
        const user = await User.findById(UserId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        // await user.save({ validateBeforeSave: false })
console.log(accessToken)
        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
};


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

const existedUser=await User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    throw new ApiError(409,"User with duplicate username or email ! ")
}


const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path;
let coverImageLocalpath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage/length>0){
    coverImageLocalpath=req.files.coverImage[0].path
}

if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required")
}

const avatar = await uploadOnCLoudinary(avatarLocalPath)
const coverImage = await uploadOnCLoudinary(coverImageLocalPath)

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
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
)



})





 const loginUser = asyncHandler (
    async (req,res) =>{
        // req body -> data
        //username or email
        //find the user
        //password check    
        //access and refresh token
        //send cookie


        const{email,username,password}=req.body
        console.log(req.body)
        console.log(username)

        if(!username && !email){
            throw new ApiError(400,"Username or Password is reqired")
        }
        const user = await User.findOne({
            $or:[{email},{username}]
        })

        if (!user) {
            throw new ApiError(400,"user not registered")
        }
        
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!user) {
            throw new ApiError(400,"Invalid user credentials")
        }
        const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

        //Costly OPERATION WARNING
        //WARNING
        //WARNING

        const loggedUser = await User.findById(user._id).select("-password -refreshToken")


        //GENERATING Cookies
        const option  = {
            httpOnly:true,
            secure:true
        }
      

        return res.status(200).cookie("accessToken",accessToken,option).cookie("refreshToken",refreshToken,option).json(new ApiResponse(200,{
            user:loggedUser,accessToken,refreshToken
        },"user logged in successfully"))




    }
 )


 const logOutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
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
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {registerUser,loginUser,logOutUser}