import CommentModel from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.userId;

    const newComment = new CommentModel({
      postId,
      userId,
      text,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating a comment" });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId }).populate("userId", "fullName avatar");
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving all comments" });
  }
};
