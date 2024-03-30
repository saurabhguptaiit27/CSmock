import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Expert } from "../models/expert.models.js";
import { Booking } from "../models/booking.models.js";
import { Report } from "../models/report.models.js";

const giveReport = asyncHandler(async (req, res) => {
  const {
    bookingId,
    round1Rating,
    round1Comment,
    round2Rating,
    round2Comment,
    round3Rating,
    round3Comment,
    overallComment,
  } = req.body;

  if (
    [
      bookingId,
      round1Rating,
      round1Comment,
      round2Rating,
      round2Comment,
      round3Rating,
      round3Comment,
      overallComment,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    console.log("Booking not found");
    return;
  }

  // Check if report already exists for this booking
  const existingReport = await Report.findOne({ booking: bookingId });
  if (existingReport) {
    throw new ApiError(400, "Report already exists for this booking");
  }

  // Extract user and expert IDs from the booking
  const userId = booking.user;
  const expertId = booking.expert;

  const user = await User.findById(userId).select("-password -refreshToken");

  const expert = await Expert.findById(expertId).select(
    "-password -refreshToken"
  );

  if (!user || !expert) {
    throw new ApiError(
      500,
      "Something went wrong while searching for the user or expert when giving report"
    );
  }

  const report = await Report.create({
    booking: bookingId,
    round1Rating,
    round1Comment,
    round2Rating,
    round2Comment,
    round3Rating,
    round3Comment,
    overallComment,
  });

  await report.save();

  booking.report = report._id;
  await booking.save();

  // Add the report ID to user's report array
  user.reportHistory.unshift(report._id);
  await user.save({ validateBeforeSave: false });

  expert.reportHistory.unshift(report._id);
  await expert.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(200, report, "report generated Successfully"));
});

const getReport = asyncHandler(async (req, res) => {
  const { bookingId } = req.query;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    console.log("Booking not found");
    return;
  }
  const reportId = booking.report;

  if (!reportId) {
    console.log("Report not found for this booking");
    return;
  }

  const report = await Report.findById(reportId);

  return res
    .status(201)
    .json(new ApiResponse(200, report, "report fetched Successfully"));
});

export { giveReport, getReport };
