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
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
