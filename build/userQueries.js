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
exports.getTopUsersWithLatestCommentsQuery = void 0;
const db_1 = __importDefault(require("./src/config/db")); // Adjust the path to your db config if necessary
// Query to get the top 3 users with the most posts and their latest comment
const getTopUsersWithLatestCommentsQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    WITH RankedComments AS (
      SELECT 
        users.id AS userId, 
        users.name, 
        posts.id AS postId, 
        posts.title, 
        comments.content, 
        ROW_NUMBER() OVER (PARTITION BY posts.id ORDER BY comments."createdAt" DESC) AS comment_rank,
        COUNT(posts.id) OVER (PARTITION BY users.id) AS post_count
      FROM users
      LEFT JOIN posts ON users.id = posts."userId"  -- Use double quotes for correct casing
      LEFT JOIN comments ON posts.id = comments."postId"  -- Use double quotes for correct casing
    )
    SELECT userId, name, title, content
    FROM RankedComments
    WHERE comment_rank = 1  -- Select the latest comment for each post
    ORDER BY post_count DESC  -- Order users by the number of posts
    LIMIT 3;  -- Limit to top 3 users
  `;
    try {
        // Executing the query using Sequelize
        const [results] = yield db_1.default.query(query);
        return results;
    }
    catch (error) {
        // Handle the error and ensure correct typing
        if (error instanceof Error) {
            throw new Error(`Error executing query: ${error.message}`);
        }
        else {
            throw new Error('An unknown error occurred while executing the query');
        }
    }
});
exports.getTopUsersWithLatestCommentsQuery = getTopUsersWithLatestCommentsQuery;
