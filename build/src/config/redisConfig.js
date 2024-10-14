"use strict";
// local
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.connectRedis = void 0;
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
const redis_1 = require("redis");
let redisClient = null;
exports.redisClient = redisClient;
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisClient) {
        const redisHost = process.env.REDIS_HOST; // Use Docker service name
        const redisPort = process.env.REDIS_PORT;
        const redisPassword = process.env.REDIS_PASSWORD || ''; // Optional password
        const redisUrl = `redis://${redisHost}:${redisPort}`;
        console.log('Redis connection details:');
        console.log(`REDIS_HOST: ${redisHost}`);
        console.log(`REDIS_PORT: ${redisPort}`);
        console.log(`Attempting to connect to Redis at ${redisUrl}`);
        exports.redisClient = redisClient = (0, redis_1.createClient)({
            url: redisUrl,
            password: redisPassword, // Include password if it's set
        });
        redisClient.on('error', (err) => {
            console.error('Redis error:', err);
        });
        try {
            yield redisClient.connect();
            console.log('Connected to Redis successfully');
        }
        catch (error) {
            console.error('Error connecting to Redis:', error);
            throw error;
        }
    }
    return redisClient;
});
exports.connectRedis = connectRedis;
// Call the function to connect to Redis when your application starts
connectRedis().catch((err) => {
    console.error('Failed to connect to Redis:', err);
});
