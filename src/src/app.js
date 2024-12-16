import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import dotenv from 'dotenv';
import { initRedisClient } from './init/redis.js';

//https://github.com/devbong92/sparta-websocket-dino -> 참고

const app = express();
const server = createServer(app);

const PORT = 3000;

dotenv.config();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await loadGameAssets();
    //console.log(assets);
    console.log('Assets loaded successfully');

    // redis 설정
    await initRedisClient();
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }
});
