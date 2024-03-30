import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    createrId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createrType: {
      type: String,
      enum: ["User", "Expert"],
    },
    content: {
      type: String,
    },
    postedOn: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    savedBy: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
