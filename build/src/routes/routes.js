"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const controller_1 = require("../controllers/controller");
const authMiddleware_1 = __importDefault(require("../../src/middlewares/authMiddleware"));
const router = (0, express_1.Router)();
// Define your routes
router.post('/users', controller_1.createUser);
router.get('/users', controller_1.getUsers);
router.get('/top-users', controller_1.getTopUsersWithLatestComments);
router.post('/users/:id/posts', authMiddleware_1.default, controller_1.createPost);
router.get('/users/:id/posts', controller_1.getUserPosts);
router.post('/posts/:postId/comments', authMiddleware_1.default, controller_1.addComment);
exports.default = router;
