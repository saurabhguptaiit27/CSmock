import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerExpert, loginExpert, logoutExpert, refreshAccessToken } from "../controllers/expert.controller.js";
import { verifyJWT } from "../middlewares/expertauth.middleware.js";

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

router.route("/login").post(loginExpert)


//secured routes
router.route("/logout").post(verifyJWT, logoutExpert)
router.route("/refresh-token").post(refreshAccessToken)


export default router;