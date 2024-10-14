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

const dbName = process.env.POSTGRES_DB || 'railway';
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbHost = process.env.PGHOST || '';
const dbPassword = process.env.POSTGRES_PASSWORD || '';
const dbPort = parseInt(process.env.PGPORT || '5432');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000 // Increase timeout to 60 seconds
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  logging: false,
  retry: {
    max: 5, // Maximum retry 5 times
    timeout: 3000 // Retry every 3 seconds
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
export { testConnection };