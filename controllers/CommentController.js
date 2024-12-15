import CommentModel from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      postid: req.body.postid,
      userId: req.userId
    })
    const comment = await doc.save();
    res.json(comment);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating comment'
    })
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
