
// local


// import { createClient, RedisClientType } from 'redis';

// let redisClient: RedisClientType | null = null;

// const connectRedis = async (): Promise<RedisClientType> => {
//   if (!redisClient) {
//     const redisHost = process.env.REDIS_HOST || '127.0.0.1';
//     const redisPort = process.env.REDIS_PORT || 6379;
//     const redisPassword = process.env.REDIS_PASSWORD || ''; // Optional password

//     const redisUrl = `redis://${redisHost}:${redisPort}`;

//     console.log('Redis connection details:');
//     console.log(`REDIS_HOST: ${redisHost}`);
//     console.log(`REDIS_PORT: ${redisPort}`);
//     console.log(`Attempting to connect to Redis at ${redisUrl}`);

//     redisClient = createClient({
//       url: redisUrl,
//       password: redisPassword, // Include password if it's set
//     });

//     redisClient.on('error', (err) => {
//       console.error('Redis error:', err);
//     });

//     try {
//       await redisClient.connect();
//       console.log('Connected to Redis successfully');
//     } catch (error) {
//       console.error('Error connecting to Redis:', error);
//       throw error;
//     }
//   }

//   return redisClient;
// };

// // Export the Redis client and connectRedis function
// export { connectRedis, redisClient };

// // Call the function to connect to Redis when your application starts
// connectRedis().catch((err) => {
//   console.error('Failed to connect to Redis:', err);
// });














import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

const connectRedis = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    const redisHost = process.env.REDIS_HOST // Use Docker service name
    const redisPort = process.env.REDIS_PORT;
    const redisPassword = process.env.REDIS_PASSWORD || ''; // Optional password

    const redisUrl = `redis://${redisHost}:${redisPort}`;

    console.log('Redis connection details:');
    console.log(`REDIS_HOST: ${redisHost}`);
    console.log(`REDIS_PORT: ${redisPort}`);
    console.log(`Attempting to connect to Redis at ${redisUrl}`);

    redisClient = createClient({
      url: redisUrl,
      password: redisPassword, // Include password if it's set
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    try {
      await redisClient.connect();
      console.log('Connected to Redis successfully');
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw error;
    }
  }

  return redisClient;
};

// Export the Redis client and connectRedis function
export { connectRedis, redisClient };

// Call the function to connect to Redis when your application starts
connectRedis().catch((err) => {
  console.error('Failed to connect to Redis:', err);
});
