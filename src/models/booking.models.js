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
            type: String,
            required: true
        },
        bookedAt: {
            type: String,
            required: true
        },
        noteToExpert: {
            type: String
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
