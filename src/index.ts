// import dotenv from 'dotenv';
// dotenv.config();

// import express, { Request, Response } from 'express';
// import sequelize, { testConnection } from './config/db'
// import syncDatabase from './config/sync';
// import routes from './routes/routes';
// import swaggerUi from 'swagger-ui-express';
// import swaggerOptions from '../swaggerOptions';

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());
// app.use('/api', routes);

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// // Set up the root route
// app.get('/', (req: Request, res: Response) => {
//   res.send('API is working!');
// });

// // Function to start the server
// // const startServer = async () => {
// //   try {
// //     console.log('Environment variables loaded successfully.');

// //     // Connect to the database
// //     console.log('Attempting to connect to the database...');
// //     await sequelize.authenticate();
// //     console.log('Database connected successfully');

// //     // Sync database
// //     await syncDatabase();

// //     // Start the server
// //     app.listen(PORT, () => {
// //       console.log(`Server is running on port ${PORT}`);
// //     });
// //   } catch (error) {
// //     console.error('Error starting the server:', error);
// //   }
// // };
// const startServer = async () => {
//   let retries = 5;
//   while (retries) {
//     try {
//       await testConnection();
//       console.log('Database connection successful');
      
//       app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//       });
      
//       return; // Exit the function if successful
//     } catch (error) {
//       console.error('Failed to connect to the database:', error);
//       retries -= 1;
//       console.log(`Retries left: ${retries}`);
//       // Wait for 5 seconds before retrying
//       await new Promise(res => setTimeout(res, 5000));
//     }
//   }
  
//   console.error('Unable to connect to the database after multiple attempts. Exiting...');
//   process.exit(1);
// };
// // Start the server
// startServer();

// export default app; 






import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import { sequelize } from './config/db';
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
  let retries = 5;
  while (retries) {
    try {
      console.log('Attempting to connect to the database...');
      await sequelize.authenticate();
      console.log('Database connection successful');

      // Log all non-sensitive environment variables
      console.log('Environment variables:', {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        PGHOST: process.env.PGHOST,
        PGPORT: process.env.PGPORT,
        PGDATABASE: process.env.PGDATABASE,
        PGUSER: process.env.PGUSER,
        // Don't log PGPASSWORD or other sensitive data
      });

      // Sync database (be careful with this in production)
      if (process.env.NODE_ENV !== 'production') {
        await syncDatabase(sequelize);
      }

      server = http.createServer(app);
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });

      return; // Exit the function if successful
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      // Wait for 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
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
      sequelize.close().then(() => {
        console.log('Database connection closed');
        process.exit(0);
      });
    });
  } else {
    console.log('HTTP server not running');
    process.exit(0);
  }
});

// Start the server
startServer();

export default app;