import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: 1
        },
        comment: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
