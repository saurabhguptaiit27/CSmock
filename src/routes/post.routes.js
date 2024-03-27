import { Router } from "express";
import {
  createPost,
  getALLPosts,
  deletePost,
  editPost,
} from "../controllers/post.controller.js";
import { createrVerifyJWT } from "../middlewares/createrauth.middleware.js";

const router = Router();

router.route("/createpost").post(createrVerifyJWT, createPost);
router.route("/getallposts").get(getALLPosts);
router.route("/deletepost").post(createrVerifyJWT, deletePost);
router.route("/editpost").post(createrVerifyJWT, editPost);

export default router;
