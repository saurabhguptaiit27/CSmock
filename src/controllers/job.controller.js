import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expert } from "../models/expert.models.js";
import { Job } from "../models/job.models.js";

const createJob = asyncHandler(async (req, res) => {
  const {
    createrId,
    jobOrganisation,
    jobSalary,
    jobCategory,
    jobTitle,
    jobDescription,
    jobLocation,
    jobType,
    requiredQualification,
    requiredExperience,
    requiredSkills,
    postedOn,
    validTill,
  } = req.body;

  if (
    [createrId, jobTitle, jobDescription].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "jobTitle, jobDescription fields are required");
  }

  // find the expert who posted the job

  const creater = await Expert.findById(createrId).select(
    "-password -refreshToken"
  );

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the creater who is creating Job post"
    );
  }

  const job = await Job.create({
    createrId,
    jobOrganisation,
    jobSalary,
    jobCategory,
    jobTitle,
    jobDescription,
    jobLocation,
    jobType,
    requiredQualification,
    requiredExperience,
    requiredSkills,
    postedOn,
    validTill,
  });

  await job.save();

  creater.jobsPosted.unshift(job._id);
  await creater.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(200, job, "Job posted Successfully"));
});

const getALLJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "All jobs are Fetched"));
});

const deleteJob = asyncHandler(async (req, res) => {
  const { jobId, createrId } = req.query;

  // Find and delete the job document
  const deletedJob = await Job.findByIdAndDelete(jobId);
  if (!deletedJob) {
    throw new ApiError(500, "Something went wrong while deleting job");
  }

  const creater = await Expert.findById(createrId).select(
    "-password -refreshToken"
  );

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the creater when deleting job post reference"
    );
  }
  // Remove postId from jobsPosted array of creater/Expert
  creater.jobsPosted = creater.postHistory.filter(
    (id) => id.toString() !== jobId
  );
  await creater.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "job post and its reference in creater is deleted successfully"
      )
    );
});

const saveJob = asyncHandler(async (req, res) => {
  //here creater is that who want to save the post
  const { jobId, createrId, createrType } = req.query;

  const creater =
    createrType === "User"
      ? await User.findById(createrId).select("-password -refreshToken")
      : await Expert.findById(createrId).select("-password -refreshToken");

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the user/expert who want to save the job post"
    );
  }
  // save jobId in jobsSaved array of saver
  creater.jobsSaved.unshift(jobId);
  await creater.save({ validateBeforeSave: false });

  const job = await Job.findById(jobId);
  job.savedBy.unshift(createrId);
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "job post saved successfully"));
});

const unSaveJob = asyncHandler(async (req, res) => {
  //here creater is that who want to unsave the job
  const { jobId, createrId, createrType } = req.query;

  const creater =
    createrType === "User"
      ? await User.findById(createrId).select("-password -refreshToken")
      : await Expert.findById(createrId).select("-password -refreshToken");

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the user/expert who want to unsave the job post"
    );
  }
  // unsave jobId from jobsSaved array of unsaver
  creater.jobsSaved = creater.jobsSaved.filter(
    (savedJobId) => savedJobId.toString() !== jobId
  );
  await creater.save({ validateBeforeSave: false });
  //remove saverId from job savedBy array
  const job = await Job.findById(jobId);
  job.savedBy = job.savedBy.filter(
    (sCreaterId) => sCreaterId.toString() !== createrId
  );
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "job post unsaved successfully"));
});

const applyJob = asyncHandler(async (req, res) => {
  //here creater is that who want to save the post
  const { jobId, createrId } = req.query;

  const creater = await User.findById(createrId).select(
    "-password -refreshToken"
  );

  if (!creater) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the user who want to apply for the job"
    );
  }
  // save jobId in jobsSaved array of saver
  creater.jobsApplied.unshift(jobId);
  await creater.save({ validateBeforeSave: false });

  const job = await Job.findById(jobId);
  job.appliedBy.unshift(createrId);
  await job.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "job applied successfully"));
});

export { createJob, getALLJobs, deleteJob, saveJob, unSaveJob, applyJob };
