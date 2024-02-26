import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerExpert, loginExpert, logoutExpert, refreshAccessToken, changeCurrentPassword, getCurrentExpert, updateAccountDetails, updateExpertAvatar, updateExpertCoverImage } from "../controllers/expert.controller.js";
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
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-expert").get(verifyJWT, getCurrentExpert)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateExpertAvatar)
router.route("/update-coverimage").patch(verifyJWT, upload.single("coverImage"), updateExpertCoverImage)



export default router;