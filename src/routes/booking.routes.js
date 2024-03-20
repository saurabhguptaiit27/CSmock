import { Router } from "express";
import { appointmentBooking, getBookingById, cancelBooking, concludeBooking } from "../controllers/booking.controller.js";

const router = Router();


router.route("/appointmentbooking").post(appointmentBooking);
router.route("/getbookingbyid").post(getBookingById);
router.route("/cancelbooking").post(cancelBooking);
router.route("/concludebooking").post(concludeBooking);

export default router;