import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);
