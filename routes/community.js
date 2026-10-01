const express = require('express');
const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const REPORT_HIDE_THRESHOLD = 3;

function toPostResponse(post) {
  return {
    id: post.id,
    content: post.content,
    isAnonymous: post.isAnonymous,
    displayName: post.isAnonymous ? 'Anonymous' : (post.author?.firstName || 'User'),
    createdAt: post.createdAt,
    commentCount: post.comments ? post.comments.length : 0
  };
}

function toCommentResponse(comment) {
  return {
    id: comment.id,
    postId: comment.postId,
    content: comment.content,
    isAnonymous: comment.isAnonymous,
    displayName: comment.isAnonymous ? 'Anonymous' : (comment.author?.firstName || 'User'),
    createdAt: comment.createdAt
  };
}

router.get('/posts', async (req, res) => {
  try {
    const posts = await CommunityPost.findAll({
      where: { isHidden: false },
      include: [
        { model: User, as: 'author', attributes: ['firstName'] },
        { model: CommunityComment, as: 'comments', attributes: ['id'], where: { isHidden: false }, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts.map(toPostResponse));
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const post = await CommunityPost.create({
      content: content.trim(),
      isAnonymous: !!isAnonymous,
      userId: req.userId
    });

    const user = await User.findByPk(req.userId, { attributes: ['firstName'] });

    res.status(201).json(toPostResponse({ ...post.toJSON(), author: user, comments: [] }));
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await CommunityComment.findAll({
      where: { postId: req.params.postId, isHidden: false },
      include: [{ model: User, as: 'author', attributes: ['firstName'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json(comments.map(toCommentResponse));
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const post = await CommunityPost.findByPk(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const comment = await CommunityComment.create({
      content: content.trim(),
      isAnonymous: !!isAnonymous,
      postId: req.params.postId,
      userId: req.userId
    });

    const user = await User.findByPk(req.userId, { attributes: ['firstName'] });

    res.status(201).json(toCommentResponse({ ...comment.toJSON(), author: user }));
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/posts/:postId/report', async (req, res) => {
  try {
    const post = await CommunityPost.findByPk(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.reportCount += 1;

    if (post.reportCount >= REPORT_HIDE_THRESHOLD) {
      post.isHidden = true;
    }

    await post.save();

    res.json({ message: 'Post reported. Thank you for helping keep the community safe.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

router.post('/comments/:commentId/report', async (req, res) => {
  try {
    const comment = await CommunityComment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    comment.reportCount += 1;

    if (comment.reportCount >= REPORT_HIDE_THRESHOLD) {
      comment.isHidden = true;
    }

    await comment.save();

    res.json({ message: 'Comment reported. Thank you for helping keep the community safe.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;