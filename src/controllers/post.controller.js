import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expert } from "../models/expert.models.js";
import { Post } from "../models/post.models.js";

const createPost = asyncHandler(async (req, res) => {
  const { createrId, createrType, content, postedOn } = req.body;
  console.log(req.body);

  if (
    [createrId, createrType, content, postedOn].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //   const creater =
  //     createrType === "User"
  //       ? await User.findById(createrId).select("-password -refreshToken")
  //       : await Expert.findById(createrId).select("-password -refreshToken");

  let creater;
  // Query the appropriate model based on createrType
  if (createrType === "User") {
    creater = await User.findById(createrId).select("-password -refreshToken");
  } else if (createrType === "Expert") {
    creater = await Expert.findById(createrId).select(
      "-password -refreshToken"
    );
  } else {
    throw new ApiError(400, "Invalid createrType");
  }

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the creater when creating post"
    );
  }

  const post = await Post.create({
    createrId,
    createrType,
    content,
    postedOn,
  });

  await post.save();

  creater.postHistory.unshift(post._id);
  await creater.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(200, post, "post created Successfully"));
});

const getALLPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "All posts are Fetched"));
});

export { createPost, getALLPosts };
