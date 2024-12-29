import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({ createdAt: -1 }).exec();
        const postsWithComments = await Promise.all(
            posts.map(async (post) => {
                const commentsCount = await CommentModel.countDocuments({ postId: post._id });
                return { ...post._doc, commentsCount };
            })
        );
        res.json(postsWithComments)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Error fetching all posts'
        })
    }
};

// export const getTags = async (req, res) => {
//     try {
//         const posts = await PostModel.find().limit(5).exec();
//         const tags = posts.map(obj => obj.tags.flat().slice(5, 5))

//         res.json(tags)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: 'Error fetching posts tags'
//         })
//     }
// };

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().exec();
        const allTags = posts.flatMap(post => post.tags);
        const uniqueTags = [...new Set(allTags)];

        res.json(uniqueTags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching posts tags' });
    }
};

export const getOne = async (req, res) => {
    const postId = req.params.id;
    try {
        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate('user').exec();

        if (!updatedPost) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        const commentsCount = await CommentModel.countDocuments({ postId: updatedPost._id });
        res.json({ ...updatedPost._doc, commentsCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching post'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findByIdAndDelete(postId)
            .then(deletedPost => {
                if (deletedPost) {
                    res.json({
                        success: true,
                    })
                } else {
                    res.status(500).json({
                        message: 'Post not found'
                    })
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: 'Error removing post'
                })
            });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Error removing post'
        })
    }
};

export const create = async (req, res) => {
    try {
        const tags = Array.isArray(req.body.tags)
            ? req.body.tags
            : req.body.tags.split(',').map(tag => tag.trim());

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: [...new Set(tags)],
            user: req.userId
        })
        const post = await doc.save();
        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error creating post'
        })
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const tags = Array.isArray(req.body.tags)
            ? req.body.tags
            : req.body.tags.split(',').map(tag => tag.trim());

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: [...new Set(tags)],
                user: req.userId,
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ success: true, updatedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating post' });
    }
};


// export const update = async (req, res) => {
//     try {
//         const postId = req.params.id;

//         await PostModel.updateOne({
//             _id: postId,
//         }, {
//             title: req.body.title,
//             text: req.body.text,
//             imageUrl: req.body.imageUrl,
//             // tags: req.body.tags.split(','),
//             user: req.userId,
//         })

//         res.json({
//             success: true,
//         })
//     } catch (error) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Error updating post',
//         })

//     }
// };