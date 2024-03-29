import { Router } from "express";
import {
  createPost,
  getALLPosts,
  deletePost,
  editPost,
  savePost,
  unSavePost
} from "../controllers/post.controller.js";
import { createrVerifyJWT } from "../middlewares/createrauth.middleware.js";

const router = Router();

router.route("/createpost").post(createrVerifyJWT, createPost);
router.route("/getallposts").get(getALLPosts);
router.route("/deletepost").post(createrVerifyJWT, deletePost);
router.route("/editpost").post(createrVerifyJWT, editPost);
router.route("/savepost").post(createrVerifyJWT, savePost);
router.route("/unsavepost").post(createrVerifyJWT, unSavePost);

export default router;
