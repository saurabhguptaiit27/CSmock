import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    round1Rating: {
      type: Number,
      required: true,
    },
    round1Comment: {
      type: String,
    },
    round2Rating: {
      type: Number,
      required: true,
    },
    round2Comment: {
      type: String,
    },
    round3Rating: {
      type: Number,
      required: true,
    },
    round3Comment: {
      type: String,
    },
    overallComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);
