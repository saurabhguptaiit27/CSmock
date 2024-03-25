import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expert } from "../models/expert.models.js";
import { Post } from "../models/post.models.js";

const createPost = asyncHandler(async (req, res) => {
  const { createrId, createrType, content, postedOn } = req.body;


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
  const posts = await Post.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "All posts are Fetched"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId, createrId, createrType } = req.query;

  // Find and delete the post document
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    throw new ApiError(500, "Something went wrong while deleting post");
  }

  // Remove the postId from the postHistory array of the corresponding User or Expert document
  const creater =
    createrType === "User"
      ? await User.findById(createrId).select("-password -refreshToken")
      : await Expert.findById(createrId).select("-password -refreshToken");

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the creater when deleting post reference"
    );
  }
  // Remove postId from postHistory array of creater
  creater.postHistory = creater.postHistory.filter(
    (id) => id.toString() !== postId
  );
  await creater.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "post and its reference in creater is deleted successfully"
      )
    );
});

export { createPost, getALLPosts, deletePost };
