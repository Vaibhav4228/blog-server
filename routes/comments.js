import express, { Router } from  "express";
import Comment from "../models/Comment.js";
import verifyToken from "../verifyToken.js";

const router = express.Router();

// CREATE
router.post('/create', verifyToken, async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json('Comment has been deleted!');
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/post/:postId",async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json(err)
    }
});


export default router;
