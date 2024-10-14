import { Sequelize } from 'sequelize';
import User from '../../models/User'; // Ensure these paths are correct
import Post from '../../models/Posts';
import Comment from '../../models/Comments';

const syncDatabase = async (sequelize: Sequelize) => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

export default syncDatabase;