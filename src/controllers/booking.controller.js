import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expert } from "../models/expert.models.js";
import { Booking } from "../models/booking.models.js";



const appointmentBooking = asyncHandler(async (req, res) => {


    const { userId, expertId, dateTimeOfBooking } = req.body
    //console.log("email: ", email);

    if (
        [userId, expertId, dateTimeOfBooking].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //console.log(req.files);


    const user = await User.findById(userId).select(
        "-password -refreshToken"
    )

    const expert = await Expert.findById(expertId).select(
        "-password -refreshToken"
    )

    if (!user || !expert) {
        throw new ApiError(500, "Something went wrong while searching for the user or expert")
    }

    const booking = await Booking.create({
        user: userId,
        expert: expertId,
        appointmentDateTime: dateTimeOfBooking
    })

    await booking.save();

    user.bookingHistory.push(booking._id);
    await user.save({ validateBeforeSave: false });

    // Add the booking ID to expert's bookings array
    expert.bookingHistory.push(booking._id);
    await expert.save({ validateBeforeSave: false });

    return res.status(201).json(
        new ApiResponse(200, booking, "appointment booking done Successfully")
    )

})

export { appointmentBooking }