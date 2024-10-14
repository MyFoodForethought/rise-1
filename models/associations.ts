// // db.ts (or a new file called associations.ts)
// import User from '../models/User';
// import Post from '../models/Posts';
// import Comment from '../models/Comments';

// // Define associations
// User.hasMany(Post, { foreignKey: 'userId' });
// Post.belongsTo(User, { foreignKey: 'userId' });

// Post.hasMany(Comment, { foreignKey: 'postId' });
// Comment.belongsTo(Post, { foreignKey: 'postId' });

// // Export models if needed
// export { User, Post, Comment };



import User from '../models/User';
import Post from '../models/Posts';
import Comment from '../models/Comments';

// Define associations with aliases
User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// Export models if needed
export { User, Post, Comment };
