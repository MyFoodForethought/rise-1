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
import dns from 'dns';
import { promisify } from 'util';

const dbName = process.env.POSTGRES_DB || 'railway';
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbHost = process.env.PGHOST || '';
const dbPassword = process.env.POSTGRES_PASSWORD || '';
const dbPort = parseInt(process.env.PGPORT || '5432');

const dnsLookup = promisify(dns.lookup);

const createSequelizeInstance = async () => {
  let host = dbHost;
  try {
    const { address } = await dnsLookup(dbHost, { family: 4 });
    host = address;
    console.log(`Resolved host to IPv4 address: ${host}`);
  } catch (error) {
    console.error('Failed to resolve host to IPv4:', error);
  }

  return new Sequelize(dbName, dbUser, dbPassword, {
    host: host,
    port: dbPort,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    logging: console.log,  // Enable logging for debugging
    retry: {
      max: 5,
      timeout: 3000
    }
  });
};

const testConnection = async () => {
  const sequelize = await createSequelizeInstance();
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export { createSequelizeInstance, testConnection };