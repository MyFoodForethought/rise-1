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
  try {
    await testConnection(); // Test the database connection

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};
// Start the server
startServer();

export default app; 
