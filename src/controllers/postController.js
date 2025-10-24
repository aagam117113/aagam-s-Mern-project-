import Post from "../models/Post.js";

/**
 * Create Post
 * POST /api/posts
 * headers: Authorization: Bearer <token>
 * body: { title, content }
 * response: { post } or just the post object
 */

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Missing title or content" });

    const post = await Post.create({ title, content, author: req.user.id });
    // Frontend expects just the post object with _id
    const populatedPost = await Post.findById(post._id).populate("author", "name email");
    res.status(201).json(populatedPost); // Return post directly, not wrapped in {post}
  } catch (err) {
    next(err);
  }
};

/**
 * Get all posts
 * GET /api/posts
 * response: array of posts (not wrapped in {posts})
 */

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "name email").sort({ createdAt: -1 });
    res.json(posts); // Return array directly, not {posts: posts}
  } catch (err) {
    next(err);
  }
};

/**
 * Get single post
 * GET /api/posts/:id
 * response: post object (not wrapped in {post})
 */

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post); // Return post directly, not {post}
  } catch (err) {
    next(err);
  }
};

/**
 * Update post
 * PUT /api/posts/:id
 * headers: Authorization: Bearer <token>
 * body: { title?, content? }
 * response: updated post object
 */

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;
    await post.save();
    const updated = await Post.findById(post._id).populate("author", "name email");
    res.json(updated); // Return post directly
  } catch (err) {
    next(err);
  }
};

/**
 * Delete post
 * DELETE /api/posts/:id
 * headers: Authorization: Bearer <token>
 * response: { message: "Deleted" }
 */

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    await Post.findByIdAndDelete(req.params.id); // Use findByIdAndDelete instead of remove()
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};
