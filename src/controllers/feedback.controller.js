import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expert } from "../models/expert.models.js";
import { Booking } from "../models/booking.models.js";
import { Feedback } from "../models/feedback.models.js";



const giveFeedback = asyncHandler(async (req, res) => {


    const { bookingId, rating, comment } = req.body

    if (
        [bookingId, rating].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //console.log(req.files);

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        console.log('Booking not found');
        return;
    }

    // Extract user and expert IDs from the booking
    const userId = booking.user;
    const expertId = booking.expert;



    const user = await User.findById(userId).select(
        "-password -refreshToken"
    )

    const expert = await Expert.findById(expertId).select(
        "-password -refreshToken"
    )

    if (!user || !expert) {
        throw new ApiError(500, "Something went wrong while searching for the user or expert")
    }

    const feedback = await Feedback.create({
        booking: bookingId,
        rating,
        comment
    })

    await feedback.save();

    user.feedbackHistory.push(feedback._id);
    await user.save({ validateBeforeSave: false });

    // Add the feedback ID to expert's feedback array
    expert.feedbackHistory.push(feedback._id);
    await expert.save({ validateBeforeSave: false });

    return res.status(201).json(
        new ApiResponse(200, feedback, "feedback given Successfully")
    )

})

export { giveFeedback }