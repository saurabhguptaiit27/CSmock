import { Router } from "express";
import {
  createPost,
  getALLPosts,
  deletePost,
} from "../controllers/post.controller.js";

const router = Router();

router.route("/createpost").post(createPost);
router.route("/getallposts").get(getALLPosts);
router.route("/deletepost").post(deletePost);
export default router;
