import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Expert } from "../models/expert.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerExpert = asyncHandler(async (req, res) => {
    // get expert details from frontend
    // validation - not empty
    // check if expert already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, check for avatar uploaded or not
    // create expert object - create entry in db
    // remove password and refresh token field from response
    // check for expert creation
    // return response

    const { fullname, email, username, password, fees, proficiency, gender, phone, experience, expertise, previousCompanies } = req.body
    //console.log("email: ", email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedExpert = await Expert.findOne({
        $or: [{ username }, { email }]
    })

    if (existedExpert) {
        throw new ApiError(409, "Expert with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // multer middlware add extra features to request hence we got req.files

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file not able to upload on cloudinary")
    }


    const expert = await Expert.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
        fees,
        proficiency,
        gender,
        phone,
        experience,
        previousCompanies,
        expertise
    })

    const createdExpert = await Expert.findById(expert._id).select(
        "-password -refreshToken"
    )

    if (!createdExpert) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdExpert, "Expert registered Successfully")
    )

})



const generateAccessAndRefereshTokens = async (expertId) => {
    try {
        const expert = await Expert.findById(expertId)
        const accessToken = expert.generateAccessToken()
        const refreshToken = expert.generateRefreshToken()

        expert.refreshToken = refreshToken
        await expert.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token for expert")
    }
}

const loginExpert = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the expert
    //password check
    //access and referesh token
    //send cookie

    const { email, username, password } = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")

    // }

    const expert = await Expert.findOne({
        $or: [{ username }, { email }]
    })

    if (!expert) {
        throw new ApiError(404, "Expert does not exist")
    }

    const isPasswordValid = await expert.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid expert credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(expert._id)

    const loggedInExpert = await Expert.findById(expert._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    // this options object is used to secure cookies from frontend

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInExpert, accessToken, refreshToken
                },
                "Expert logged In Successfully"
            )
        )

})



const logoutExpert = asyncHandler(async (req, res) => {
    await Expert.findByIdAndUpdate(
        req.expert._id,
        //this req.expert got from verifyJWT middleware 
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
        .json(new ApiResponse(200, {}, "Expert logged Out"))
})


export { registerExpert, loginExpert, logoutExpert }