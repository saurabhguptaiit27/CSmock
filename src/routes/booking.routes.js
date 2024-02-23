import { Router } from "express";
import { appointmentBooking } from "../controllers/booking.controller.js";

const router = Router();


router.route("/appointmentbooking").post(appointmentBooking);

export default router;