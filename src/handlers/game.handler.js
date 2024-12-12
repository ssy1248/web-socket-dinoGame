import { getStage, setStage, clearStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  
  clearStage(uuid);

  // stages 배열에서 0번째 = 첫번째 스테이지
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  //클라이언트는 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  //각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    const stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지 지속 시간 (초 단위)
    totalScore += stageDuration; // 1초당 1점
  });

  // 점수와 타임스탬프 검증
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // DB 저장
  // 저장
  // setResult(userId, score, timestamp);

  return { status: 'success', message: 'Game ended', score};
};
