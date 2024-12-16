import redisClient from '../init/redis.js';

const HIGHSCORE_KEY_PREFIX = 'highscore:';
const HIGHSCORECOORDS_KEY_PREFIX = 'highscorecoords:';
const RANK_KEY_PREFIX = 'ranks:';
const TTL = 60 * 60 * 24 * 7; // 7일

// const rank = {};

// 랭킹 초기화
export const initRank = async () => {
  await redisClient.set(HIGHSCORE_KEY_PREFIX, JSON.stringify({ score: 0, userId: '' }), {
    EX: TTL,
  });
};

// 최고 점수 조회
export const getHighScore = async () => {
  // return rank['highScore'];
  const highScore = await redisClient.get(HIGHSCORE_KEY_PREFIX);
  return JSON.parse(highScore);
};

export const getHighScorerCoords = async () => {
  // return rank['highScore'];
  const coords = await redisClient.lRange(HIGHSCORECOORDS_KEY_PREFIX, 0, -1);
  coords.forEach((e) => JSON.parse(e));
  return coords;
};

// 최고 점수 조회
export const setHighScore = async (score, userId, coords) => {
  // rank['highScore'] = { score, userId };
  await redisClient.set(HIGHSCORE_KEY_PREFIX, JSON.stringify({ score, userId }), { EX: TTL });
  coords.forEach(async (e) => {
    await redisClient.rPush(HIGHSCORECOORDS_KEY_PREFIX, JSON.stringify(e), { EX: TTL });
  });
};

// 랭킹 조회
export const getRankList = async () => {
  const arr = await redisClient.keys(RANK_KEY_PREFIX + '*');
  const ranks = [];
  if (arr) {
    for (let tmp of arr) {
      const res = await redisClient.get(tmp);
      ranks.push(JSON.parse(res));
    }
  }
  return ranks;
};

// 랭킹 저장
export const setRankList = async (userId, score, timestamp) => {
  await redisClient.set(RANK_KEY_PREFIX + user.uuid, JSON.stringify({ userId, score, timestamp }), {
    EX: TTL,
  });
};