import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerExpert } from "../controllers/expert.controller.js";

const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerExpert
)

export default router;