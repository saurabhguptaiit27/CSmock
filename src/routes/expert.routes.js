import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerExpert, loginExpert,addAvailability,logoutExpert, refreshAccessToken, changeCurrentPassword, getCurrentExpert, getALLExperts, updateAccountDetails, updateExpertAvatar } from "../controllers/expert.controller.js";
import { verifyJWT } from "../middlewares/expertauth.middleware.js";

const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerExpert
)

router.route("/login").post(loginExpert)


//secured routes
router.route("/logout").post(verifyJWT, logoutExpert)
router.route("/addavailability").post(verifyJWT, addAvailability)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-expert").get(verifyJWT, getCurrentExpert)
router.route("/allexperts").get(getALLExperts)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateExpertAvatar)



export default router;