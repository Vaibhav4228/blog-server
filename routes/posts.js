import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import verifyToken from '../verifyToken.js';

const router = express.Router();

// CREATE
router.post('/create', verifyToken, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.error('Error creating post:', err); 
    res.status(500).json({ message: 'Server error occurred while creating post.' });
  }
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err); 
    res.status(500).json({ message: 'Server error occurred while updating post.' });
  }
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json('Post has been deleted!');
  } catch (err) {
    console.error('Error deleting post:', err); 
    res.status(500).json({ message: 'Server error occurred while deleting post.' });
  }
});

// GET POST DETAILS
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post details:', err); 
    res.status(500).json({ message: 'Server error occurred while fetching post details.' });
  }
});

// GET POSTS
router.get('/', async (req, res) => {
  const query = req.query;

  try {
    const searchFilter = {
      title: { $regex: query.search, $options: 'i' }
    };
    const posts = await Post.find(query.search ? searchFilter : null);
    console.log(posts)
    res.status(200).json(posts);
    
  } catch (err) {
    console.error('Error fetching posts:', err); 
    res.status(500).json({ message: 'Server error occurred while fetching posts.' });
  }
});

// GET USER POSTS
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    console.error('Error fetching user posts:', err); 
    res.status(500).json({ message: 'Server error occurred while fetching user posts.' });
  }
});

export default router;