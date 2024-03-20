import { Router } from "express";
import { createPost, getALLPosts } from "../controllers/post.controller.js";

const router = Router();

router.route("/createpost").post(createPost);
router.route("/getallposts").get(getALLPosts);

export default router;
