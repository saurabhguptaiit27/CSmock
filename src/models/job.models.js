import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    createrId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createrType: {
      type: String,
      default: "Expert",
    },
    jobOrganisation: {
      type: String,
    },
    jobSalary: {
      type: String,
    },
    jobCategory: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
    },
    jobType: {
      type: String,
    },
    requiredQualification: {
      type: String,
    },
    requiredExperience: {
      type: Number,
    },
    requiredSkills: {
      type: String,
    },
    postedOn: {
      type: String,
    },
    validTill: {
      type: String,
    },
    savedBy: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    appliedBy: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
