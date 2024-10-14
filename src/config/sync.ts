import { Sequelize } from 'sequelize';

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