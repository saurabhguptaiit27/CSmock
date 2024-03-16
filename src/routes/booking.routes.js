import { Router } from "express";
import { appointmentBooking,getBookingById } from "../controllers/booking.controller.js";

const router = Router();


router.route("/appointmentbooking").post(appointmentBooking);
router.route("/getbookingbyid").post(getBookingById);

export default router;