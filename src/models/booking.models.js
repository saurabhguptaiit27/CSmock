import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        expert: {
            type: Schema.Types.ObjectId,
            ref: "Expert",
            required: true
        },
        appointmentDateTime: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Booking = mongoose.model('Booking', bookingSchema);
