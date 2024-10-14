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
exports.addComment = exports.getUserPosts = exports.createPost = exports.getTopUsersWithLatestComments = exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Posts_1 = __importDefault(require("../../models/Posts"));
const Comments_1 = __importDefault(require("../../models/Comments"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userQueries_1 = require("../../userQueries");
// User-related methods
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        const newUser = yield User_1.default.create({ name, email });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });
        res.status(201).json({ user: newUser, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
});
exports.getUsers = getUsers;
const getTopUsersWithLatestComments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topUsers = yield (0, userQueries_1.getTopUsersWithLatestCommentsQuery)();
        res.status(200).json(topUsers);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: `Error retrieving top users: ${error.message}` });
        }
        else {
            res.status(500).json({ message: 'Error retrieving top users' });
        }
    }
});
exports.getTopUsersWithLatestComments = getTopUsersWithLatestComments;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const userId = req.user.id;
    try {
        const newPost = yield Posts_1.default.create({ userId, title, content });
        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});
exports.createPost = createPost;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const posts = yield Posts_1.default.findAll({ where: { userId: id } });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
});
exports.getUserPosts = getUserPosts;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { content } = req.body;
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const userId = req.user.id;
    try {
        const post = yield Posts_1.default.findByPk(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const newComment = yield Comments_1.default.create({ postId, content, userId });
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
});
exports.addComment = addComment;
