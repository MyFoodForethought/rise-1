// import { Sequelize } from 'sequelize';

// const dbName = process.env.DB_DATABASE || 'senior_backend_test';
// const dbUser = process.env.DB_USERNAME || 'postgres';
// const dbHost = process.env.DB_HOST || 'postgres';  // Changed to 'postgres' to match service name
// const dbDriver = process.env.DB_DIALECT || 'postgres';
// const dbPassword = process.env.DB_PASSWORD || 'password';
// const dbPort = parseInt(process.env.DB_PORT || '5432');

// const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//   host: dbHost,
//   port: dbPort,
//   dialect: dbDriver as any,
//   logging: false,
// });

// export default sequelize;


import { Sequelize } from 'sequelize';

// Connect to the Railway PostgreSQL database using environment variables
const sequelize = new Sequelize(
  `postgresql://${process.env.PGUSER}:${process.env.POSTGRES_PASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  {
    dialect: 'postgres',
    logging: false, // Disable logging for production
    dialectOptions: {
      ssl: {
        require: true, // Ensures SSL connection
        rejectUnauthorized: false, // Avoids SSL certificate verification errors
      },
    },
  }
);

// Function to test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Production database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the production database:', error);
  }
};

// Export the sequelize instance and test connection function
export default sequelize;
export { testConnection };
