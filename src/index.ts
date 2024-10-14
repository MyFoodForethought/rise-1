import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import sequelize, { testConnection } from './config/db'
import syncDatabase from './config/sync';
import routes from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from '../swaggerOptions';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Set up the root route
app.get('/', (req: Request, res: Response) => {
  res.send('API is working!');
});

// Function to start the server
// const startServer = async () => {
//   try {
//     console.log('Environment variables loaded successfully.');

//     // Connect to the database
//     console.log('Attempting to connect to the database...');
//     await sequelize.authenticate();
//     console.log('Database connected successfully');

//     // Sync database
//     await syncDatabase();

//     // Start the server
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Error starting the server:', error);
//   }
// };
const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      await testConnection();
      console.log('Database connection successful');
      
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
      
      return; // Exit the function if successful
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      // Wait for 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  
  console.error('Unable to connect to the database after multiple attempts. Exiting...');
  process.exit(1);
};
// Start the server
startServer();

export default app; 
