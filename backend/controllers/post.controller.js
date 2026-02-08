const Post = require("../models/Post");

// Create Post
const createPost = async (req, res) => {
  try {
    const { text, username, userId } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const post = await Post.create({
      userId,
      username,
      text: text || "",
      imageUrl,
      likes: [],
      comments: [],
    });

    return res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("Create post error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get Public Feed
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPosts / limit);

    return res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    console.error("Get posts error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Edit Post (Owner-only) – text only
const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required to edit post" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Owner check
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    post.text = text;
    await post.save();

    return res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    console.error("Edit post error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete Post (Owner-only)
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Owner check
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted", postId });
  } catch (error) {
    console.error("Delete post error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Like / Unlike Post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(username);
    if (index === -1) {
      post.likes.push(username); // like
    } else {
      post.likes.splice(index, 1); // unlike
    }

    await post.save();
    return res.status(200).json(post); // return updated post for instant UI update
  } catch (error) {
    console.error("Like error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({ message: "Username & text required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      username,
      text,
      createdAt: new Date(),
    });

    await post.save();
    return res.status(200).json(post); // return updated post
  } catch (error) {
    console.error("Comment error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  editPost,
  deletePost,
};
