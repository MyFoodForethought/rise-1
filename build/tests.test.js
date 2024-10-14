"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./src/controllers/controller");
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
const User_1 = __importDefault(require("./models/User"));
const Posts_1 = __importDefault(require("./models/Posts"));
const Comments_1 = __importDefault(require("./models/Comments"));
describe('Controller Functions', () => {
    let mockRequest;
    let mockResponse;
    let responseObject;
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
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = { name: 'John Doe', email: 'john@example.com' };
            mockRequest.body = userData;
            User_1.default.create.mockResolvedValue(userData);
            yield (0, controller_1.createUser)(mockRequest, mockResponse);
            expect(User_1.default.create).toHaveBeenCalledWith(userData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(userData);
        }));
        it('should handle errors when creating a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Database error');
            mockRequest.body = { name: 'John Doe', email: 'john@example.com' };
            User_1.default.create.mockRejectedValue(error);
            yield (0, controller_1.createUser)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating user', error });
        }));
    });
    describe('getUsers', () => {
        it('should retrieve all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
            User_1.default.findAll.mockResolvedValue(users);
            yield (0, controller_1.getUsers)(mockRequest, mockResponse);
            expect(User_1.default.findAll).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(users);
        }));
        it('should handle errors when retrieving users', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Database error');
            User_1.default.findAll.mockRejectedValue(error);
            yield (0, controller_1.getUsers)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving users', error });
        }));
    });
    describe('getTopUsersWithLatestComments', () => {
        it('should retrieve top users with latest comments', () => __awaiter(void 0, void 0, void 0, function* () {
            const topUsers = [
                { id: 1, name: 'John', posts: [{ id: 1, comments: [{ id: 1 }] }] },
                { id: 2, name: 'Jane', posts: [{ id: 2, comments: [{ id: 2 }] }] },
            ];
            User_1.default.findAll.mockResolvedValue(topUsers);
            yield (0, controller_1.getTopUsersWithLatestComments)(mockRequest, mockResponse);
            expect(User_1.default.findAll).toHaveBeenCalledWith(expect.objectContaining({
                include: expect.any(Array),
                order: expect.any(Array),
                limit: 3,
            }));
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(topUsers);
        }));
        it('should handle errors when retrieving top users', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Database error');
            User_1.default.findAll.mockRejectedValue(error);
            yield (0, controller_1.getTopUsersWithLatestComments)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving top users', error });
        }));
    });
    describe('createPost', () => {
        it('should create a new post for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = '1';
            const postData = { title: 'Test Post', content: 'This is a test post' };
            mockRequest.params = { id: userId };
            mockRequest.body = postData;
            User_1.default.findByPk.mockResolvedValue({ id: userId });
            Posts_1.default.create.mockResolvedValue(Object.assign(Object.assign({}, postData), { userId }));
            yield (0, controller_1.createPost)(mockRequest, mockResponse);
            expect(User_1.default.findByPk).toHaveBeenCalledWith(userId);
            expect(Posts_1.default.create).toHaveBeenCalledWith(Object.assign(Object.assign({}, postData), { userId }));
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(postData));
        }));
        it('should handle user not found', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: '999' };
            mockRequest.body = { title: 'Test Post', content: 'This is a test post' };
            User_1.default.findByPk.mockResolvedValue(null);
            yield (0, controller_1.createPost)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
        }));
        it('should handle errors when creating a post', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Database error');
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: 'Test Post', content: 'This is a test post' };
            User_1.default.findByPk.mockResolvedValue({ id: '1' });
            Posts_1.default.create.mockRejectedValue(error);
            yield (0, controller_1.createPost)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating post', error });
        }));
    });
    describe('getUserPosts', () => {
        it('should retrieve posts for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = '1';
            const posts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
            mockRequest.params = { id: userId };
            Posts_1.default.findAll.mockResolvedValue(posts);
            yield (0, controller_1.getUserPosts)(mockRequest, mockResponse);
            expect(Posts_1.default.findAll).toHaveBeenCalledWith({ where: { userId } });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(posts);
        }));
        it('should handle errors when retrieving user posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Database error');
            mockRequest.params = { id: '1' };
            Posts_1.default.findAll.mockRejectedValue(error);
            yield (0, controller_1.getUserPosts)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error retrieving posts', error });
        }));
    });
    describe('addComment', () => {
        it('should add a comment to a post', () => __awaiter(void 0, void 0, void 0, function* () {
            const postId = '1';
            const commentData = { content: 'Test comment' };
            mockRequest.params = { postId };
            mockRequest.body = commentData;
            Posts_1.default.findByPk.mockResolvedValue({ id: postId });
            Comments_1.default.create.mockResolvedValue(Object.assign(Object.assign({}, commentData), { postId }));
            yield (0, controller_1.addComment)(mockRequest, mockResponse);
            expect(Posts_1.default.findByPk).toHaveBeenCalledWith(postId);
            expect(Comments_1.default.create).toHaveBeenCalledWith(Object.assign(Object.assign({}, commentData), { postId }));
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining(commentData));
        }));
        it('should handle post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { postId: '999' };
            mockRequest.body = { content: 'Test comment' };
            Posts_1.default.findByPk.mockResolvedValue(null);
            yield (0, controller_1.addComment)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Post not found' });
        }));
        it('should handle errors when adding a comment', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error('Database error');
            mockRequest.params = { postId: '1' };
            mockRequest.body = { content: 'Test comment' };
            Posts_1.default.findByPk.mockResolvedValue({ id: '1' });
            Comments_1.default.create.mockRejectedValue(error);
            yield (0, controller_1.addComment)(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error adding comment', error });
        }));
    });
});
