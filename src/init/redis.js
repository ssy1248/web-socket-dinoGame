import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

export const initRedisClient = async () => {
  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis client connected');
  });

  await redisClient.connect();

  console.log(' [ initRedisClient ] =>>> ', redisClient);
};

export default redisClient;