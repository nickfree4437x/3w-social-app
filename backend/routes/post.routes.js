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

// 👇 Wrap multer to catch errors nicely
const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post("/", uploadSingleImage, createPost);
router.get("/", getPosts);

router.post("/:postId/like", toggleLike);
router.post("/:postId/comment", addComment);

router.put("/:postId", editPost);
router.delete("/:postId", deletePost);

module.exports = router;
