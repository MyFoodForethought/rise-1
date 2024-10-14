// src/sync.ts
import sequelize from '../config/db'; // Adjust if necessary
import User from '../../models/User'; // Ensure these paths are correct
import Post from '../../models/Posts';
import Comment from '../../models/Comments';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } if you want to drop tables first
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

export default syncDatabase;
