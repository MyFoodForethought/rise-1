// src/controllers/controller.ts
import { Request, Response } from 'express';
import UserModel from '../../models/User';
import Post from '../../models/Posts';
import Comment from '../../models/Comments';
import jwt from 'jsonwebtoken';
import { getTopUsersWithLatestCommentsQuery } from '../../userQueries';



// User-related methods
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email } = req.body;
  

  try {
    const newUser = await UserModel.create({ name, email });
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h', // Token expiration time
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

export const getTopUsersWithLatestComments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topUsers = await getTopUsersWithLatestCommentsQuery();
    res.status(200).json(topUsers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: `Error retrieving top users: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Error retrieving top users' });
    }
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  const { title, content } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.user.id;

  try {
    const newPost = await Post.create({ userId, title, content });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const posts = await Post.findAll({ where: { userId: id } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving posts', error });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.user!.id;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const newComment = await Comment.create({ postId, content, userId });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};
