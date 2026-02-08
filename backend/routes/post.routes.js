const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  editPost,
  deletePost,
} = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");

router.post("/", upload.single("image"), createPost);
router.get("/", getPosts);

router.post("/:postId/like", toggleLike);
router.post("/:postId/comment", addComment);

// Owner-only
router.put("/:postId", editPost);
router.delete("/:postId", deletePost);

module.exports = router;
