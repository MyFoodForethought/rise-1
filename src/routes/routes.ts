// src/routes/userRoutes.ts
import { Router } from 'express';
import { createUser, getUsers, getTopUsersWithLatestComments, createPost, getUserPosts, addComment } from '../controllers/controller';
import authMiddleware from '../../src/middlewares/authMiddleware'; 
const router = Router();

// Define your routes

// Create a new user
router.post('/users', createUser);  // User registration (No JWT required)

// Get all users
router.get('/users', getUsers);  // Retrieve list of all users (No JWT required)

// Get top users with their latest comments
router.get('/top-users', getTopUsersWithLatestComments);  // Retrieve top users (No JWT required)

// Create a post (JWT to get userId from token)
router.post('/posts', authMiddleware, createPost);  // Authenticated route to create a post, userId from JWT

// Get posts by specific user (JWT not required for viewing)
router.get('/users/:id/posts', getUserPosts);  // Allows retrieval of a specific user's posts

// Add a comment to a post (JWT to get userId from token)
router.post('/posts/:postId/comments', authMiddleware, addComment);  // Authenticated route to add a comment to a post


export default router;
