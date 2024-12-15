import { text } from 'express';
import CommentModel from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const { commentText, postId, userId } = req.body;
    console.log('Posting comment in postId:', postId);
    const doc = new CommentModel({
      text: commentText,
      postId: postId,
      userId: userId,
    });

    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating comment',
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching comments for postId:', id);

    const comments = await CommentModel.find({ postId: id })
      .populate("userId", "fullName avatar");

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving comments of this post" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment is not found' });
    }

    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'No access!' });
    }

    await CommentModel.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};
