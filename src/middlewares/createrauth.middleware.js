import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Expert } from "../models/expert.models.js";
import { User } from "../models/user.models.js";

export const createrVerifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const createrType =
      req.body.createrType !== undefined
        ? req.body.createrType
        : req.query.createrType;


    console.log(createrType);

    if (!token) {
      throw new ApiError(401, "Unauthorized expert request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const creater =
      createrType === "User"
        ? await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
          )
        : await Expert.findById(decodedToken?._id).select(
            "-password -refreshToken"
          );

    if (!creater) {
      throw new ApiError(401, "Invalid creater Access Token");
    }

    req.creater = creater;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid creater access token");
  }
});
