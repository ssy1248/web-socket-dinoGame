import { getHighScore, setHighScore, getHighScorerCoords } from '../models/rank.model.js';


//최고 점수 업데이트 핸들러
export const updateHighScore = async (userId, payload) => {
  console.log('updateHighScore =>>>> ', userId, payload);

  // 최고점수 조회
  const highScore = await getHighScore();

  if (highScore >= payload.currentScore) {
    return { status: 'fail', message: '최고점수 아님' };
  }

  // 최고점수 저장
  Promise.all([setHighScore(payload.currentScore, userId, payload.playerCoords)]);

  return {
    broadcast: true,
    handlerId: 50,
    status: 'success',
    highScore: payload.currentScore,
    message: `NEW HIGH SCORE: ${payload.currentScore}:[${userId}]`,
  };
};

//최고점수 초기화
export const initHighScore = async () => {
  let highScore = await getHighScore();
  let highScorerCoords = await getHighScorerCoords();

  if (!highScore) {
    highScore = { score: 0 };
  }

  return {
    broadcast: true,
    handlerId: 50,
    status: 'success',
    highScore: highScore.score,
    highScoreId: highScore.userId,
    highScorerCoords: highScorerCoords,
  };
};