import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerExpert, loginExpert, logoutExpert } from "../controllers/expert.controller.js";
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


export default router;