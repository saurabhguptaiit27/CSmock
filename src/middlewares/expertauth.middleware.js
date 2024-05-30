import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Expert } from "../models/expert.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.query?.encryptionsecret ||
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized expert request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const expert = await Expert.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!expert) {
      throw new ApiError(401, "Invalid expert Access Token");
    }

    req.expert = expert;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid expert access token");
  }
});
