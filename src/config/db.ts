
import { Sequelize } from 'sequelize';


const dbName = process.env.POSTGRES_DB || 'railway';
const dbUser = process.env.POSTGRES_USER || 'postgres';
const dbHost = process.env.PGHOST || 'localhost';
const dbPassword = process.env.POSTGRES_PASSWORD || '';
const dbPort = parseInt(process.env.PGPORT || '5432');

const DB_URL = process.env.DATABASE_PUBLIC_URL as string || 'localhost'
 
// Export the Sequelize instance directly
export const sequelize = new Sequelize(DB_URL, {
  
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
  logging: console.log,
  retry: {
    max: 5,
    timeout: 3000
  }
});


export const createSequelizeInstance = async () => {
  

 
  return  sequelize

}
