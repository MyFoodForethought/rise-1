import sequelize from './src/config/db'; // Adjust the path to your db config if necessary

// Query to get the top 3 users with the most posts and their latest comment
export const getTopUsersWithLatestCommentsQuery = async () => {
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
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    // Handle the error and ensure correct typing
    if (error instanceof Error) {
      throw new Error(`Error executing query: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while executing the query');
    }
  }
};
