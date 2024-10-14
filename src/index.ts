

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import { createSequelizeInstance } from './config/db';
import syncDatabase from './config/sync';
import routes from './routes/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from '../swaggerOptions';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('API is working!');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let server: http.Server;

const startServer = async () => {
  
   
    try {
     
      const sequelize = await createSequelizeInstance();
      await sequelize.authenticate();
      console.log('Database connection successful');


        await syncDatabase(sequelize);
      

      server = http.createServer(app);
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });

      return; // Exit the function if successful
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      
    }
  

  console.error('Unable to connect to the database after multiple attempts. Exiting...');
  process.exit(1);
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      // Close database connection here if needed
      process.exit(0);
    });
  } else {
    console.log('HTTP server not running');
    process.exit(0);
  }
});

// Start the server
startServer();

export default app;