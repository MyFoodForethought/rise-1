// src/routes/userRoutes.ts
import { Router } from 'express';
import { createUser, getUsers, getTopUsersWithLatestComments, createPost, getUserPosts, addComment } from '../controllers/controller';
import authMiddleware from '../../src/middlewares/authMiddleware'; 
const router = Router();

// Define your routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/top-users', getTopUsersWithLatestComments);
router.post('/users/:id/posts', authMiddleware, createPost);
router.get('/users/:id/posts', getUserPosts);
router.post('/posts/:postId/comments',authMiddleware, addComment);

export default router;
