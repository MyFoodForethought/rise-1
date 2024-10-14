import { Request, Response } from 'express';
import {
  createUser,
  getUsers,
  getTopUsersWithLatestComments,
  createPost,
  getUserPosts,
  addComment
} from './src/controllers/controller';

// Mock Sequelize
jest.mock('sequelize');

// Mock the models
jest.mock('./models/User', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

jest.mock('./models/Posts', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

jest.mock('./models/Comments', () => ({
  create: jest.fn(),
}));

// Import mocked models
import User from './models/User';
import Post from './models/Posts';
import Comment from './models/Comments';

describe('Controller Functions', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    responseObject = {
      json: jest.fn(),
      status: jest.fn(() => responseObject),
    };
    mockResponse = responseObject;
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      mockRequest.body = userData;
      (User.create as jest.Mock).mockResolvedValue(userData);

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(userData);
    });

    it('should handle errors when creating a user', async () => {
      const error = new Error('Database error');
      mockRequest.body = { name: 'John Doe', email: 'john@example.com' };
      (User.create as jest.Mock).mockRejectedValue(error);

      await createUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating user', error });
    });
  });

  describe('getUsers', () => {
    it('should retrieve all users', async () => {
      const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
      (User.findAll as jest.Mock).mockResolvedValue(users);

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(User.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors when retrieving users', async () => {
      const error = new Error('Database error');
      (User.findAll as jest.Mock).mockRejectedValue(error);

      await getUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving users', error });
    });
  });

  describe('getTopUsersWithLatestComments', () => {
    it('should retrieve top users with latest comments', async () => {
      const topUsers = [
        { id: 1, name: 'John', posts: [{ id: 1, comments: [{ id: 1 }] }] },
        { id: 2, name: 'Jane', posts: [{ id: 2, comments: [{ id: 2 }] }] },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(topUsers);

      await getTopUsersWithLatestComments(mockRequest as Request, mockResponse as Response);

      expect(User.findAll).toHaveBeenCalledWith(expect.objectContaining({
        include: expect.any(Array),
        order: expect.any(Array),
        limit: 3,
      }));
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(topUsers);
    });

    it('should handle errors when retrieving top users', async () => {
      const error = new Error('Database error');
      (User.findAll as jest.Mock).mockRejectedValue(error);

      await getTopUsersWithLatestComments(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving top users', error });
    });
  });

  describe('createPost', () => {
    it('should create a new post for a user', async () => {
      const userId = '1';
      const postData = { title: 'Test Post', content: 'This is a test post' };
      mockRequest.params = { id: userId };
      mockRequest.body = postData;
      (User.findByPk as jest.Mock).mockResolvedValue({ id: userId });
      (Post.create as jest.Mock).mockResolvedValue({ ...postData, userId });

      await createPost(mockRequest as Request, mockResponse as Response);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(Post.create).toHaveBeenCalledWith({ ...postData, userId });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(postData));
    });

    it('should handle user not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { title: 'Test Post', content: 'This is a test post' };
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await createPost(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle errors when creating a post', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Test Post', content: 'This is a test post' };
      (User.findByPk as jest.Mock).mockResolvedValue({ id: '1' });
      (Post.create as jest.Mock).mockRejectedValue(error);

      await createPost(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating post', error });
    });
  });

  describe('getUserPosts', () => {
    it('should retrieve posts for a user', async () => {
      const userId = '1';
      const posts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
      mockRequest.params = { id: userId };
      (Post.findAll as jest.Mock).mockResolvedValue(posts);

      await getUserPosts(mockRequest as Request, mockResponse as Response);

      expect(Post.findAll).toHaveBeenCalledWith({ where: { userId } });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(posts);
    });

    it('should handle errors when retrieving user posts', async () => {
      const error = new Error('Database error');
      mockRequest.params = { id: '1' };
      (Post.findAll as jest.Mock).mockRejectedValue(error);

      await getUserPosts(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving posts', error });
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      const postId = '1';
      const commentData = { content: 'Test comment' };
      mockRequest.params = { postId };
      mockRequest.body = commentData;
      (Post.findByPk as jest.Mock).mockResolvedValue({ id: postId });
      (Comment.create as jest.Mock).mockResolvedValue({ ...commentData, postId });

      await addComment(mockRequest as Request, mockResponse as Response);

      expect(Post.findByPk).toHaveBeenCalledWith(postId);
      expect(Comment.create).toHaveBeenCalledWith({ ...commentData, postId });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(commentData));
    });

    it('should handle post not found', async () => {
      mockRequest.params = { postId: '999' };
      mockRequest.body = { content: 'Test comment' };
      (Post.findByPk as jest.Mock).mockResolvedValue(null);

      await addComment(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('should handle errors when adding a comment', async () => {
      const error = new Error('Database error');
      mockRequest.params = { postId: '1' };
      mockRequest.body = { content: 'Test comment' };
      (Post.findByPk as jest.Mock).mockResolvedValue({ id: '1' });
      (Comment.create as jest.Mock).mockRejectedValue(error);

      await addComment(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error adding comment', error });
    });
  });
});