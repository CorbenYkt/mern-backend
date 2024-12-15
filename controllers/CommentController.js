// Получаем все комментарии для конкретного поста
export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find({ postId: req.params.postId }).populate('user');
    res.status(200).json(comments);
  } catch (error) {
    console.log('Error in getComments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Создаем новый комментарий
export const createComment = async (req, res) => {
  try {
    const { text, userId, postId } = req.body;

    if (!text || !userId || !postId) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const newComment = new CommentModel({
      text,
      postId,
      user: userId,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.log('Error in createComment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};
