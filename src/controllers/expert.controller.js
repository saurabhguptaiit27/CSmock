import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Expert } from "../models/expert.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary";

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

  const {
    fullname,
    email,
    username,
    currentPosition,
    password,
    fees,
    gender,
    phone,
    experience,
    expertise,
    previousCompanies,
  } = req.body;
  //console.log("email: ", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedExpert = await Expert.findOne({
    $or: [{ username }, { email }],
  });

  if (existedExpert) {
    throw new ApiError(409, "Expert with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // multer middlware add extra features to request hence we got req.files

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file not able to upload on cloudinary");
  }
  const expert = await Expert.create({
    fullname,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
    currentPosition,
    fees,
    gender,
    phone,
    experience,
    previousCompanies,
    expertise,
  });

  const createdExpert = await Expert.findById(expert._id).select(
    "-password -refreshToken"
  );

  if (!createdExpert) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdExpert, "Expert registered Successfully")
    );
});

const generateAccessAndRefereshTokens = async (expertId) => {
  try {
    const expert = await Expert.findById(expertId);
    const accessToken = expert.generateAccessToken();
    const refreshToken = expert.generateRefreshToken();

    expert.refreshToken = refreshToken;
    await expert.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token for expert"
    );
  }
};

const loginExpert = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the expert
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const expert = await Expert.findOne({
    $or: [{ username }, { email }],
  });

  if (!expert) {
    throw new ApiError(404, "Expert does not exist");
  }

  const isPasswordValid = await expert.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid expert credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    expert._id
  );

  const loggedInExpert = await Expert.findById(expert._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .cookie("userType", "Expert")
    .json(
      new ApiResponse(
        200,
        {
          details: loggedInExpert,
          accessToken,
          refreshToken,
        },
        "Expert logged In Successfully"
      )
    );
});

const logoutExpert = asyncHandler(async (req, res) => {
  await Expert.findByIdAndUpdate(
    req.expert._id,
    //this req.expert got from verifyJWT middleware
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    // secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .clearCookie("userType")
    .json(new ApiResponse(200, {}, "Expert logged Out"));
});

const addAvailability = asyncHandler(async (req, res) => {
  const appointmentDateTime = req.body;
  await Expert.findByIdAndUpdate(
    req.expert._id,
    //this req.expert got from verifyJWT middleware
    {
      $set: {
        availability: appointmentDateTime, // this adds the data in field in document
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Expert's Availability saved"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const expert = await Expert.findById(decodedToken?._id);

    if (!expert) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== expert?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(expert._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const expert = await Expert.findById(req.expert?._id);
  const isPasswordCorrect = await expert.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  expert.password = newPassword;
  await expert.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentExpert = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.expert, "Expert fetched successfully"));
});

const getExpertById = asyncHandler(async (req, res) => {
  const expertId = req.query.string;

  const expertById = await Expert.findById(expertId).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, expertById, "Expert by Id fetched successfully")
    );
});

const getALLExperts = asyncHandler(async (req, res) => {
  const experts = await Expert.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, experts, "All Experts are Fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const expert = await Expert.findByIdAndUpdate(
    req.expert?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, expert, "Account details updated successfully"));
});

const updateExpertAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // Delete old avatar
  const oldAvatarUrl = req.expert?.avatar;
  // Delete the old avatar from Cloudinary if it exists
  if (!oldAvatarUrl) {
    throw new ApiError(400, "old avatar url not found");
  }
  // Extract the public ID from the image URL (assuming Cloudinary URLs are in the format: https://res.cloudinary.com/<cloud_name>/image/upload/<public_id>)
  const publicId = oldAvatarUrl.split("/").pop().split(".")[0];

  // Delete the image from Cloudinary
  const deletionResult = await cloudinary.uploader.destroy(publicId);
  ////////////////

  // upload new avatar after deleting old cover image on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const expert = await Expert.findByIdAndUpdate(
    req.expert?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, expert, "Avatar image updated successfully"));
});

export {
  registerExpert,
  loginExpert,
  addAvailability,
  logoutExpert,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentExpert,
  getALLExperts,
  updateAccountDetails,
  updateExpertAvatar,
  getExpertById,
};
