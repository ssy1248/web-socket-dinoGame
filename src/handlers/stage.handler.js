import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보
  let currnetStages = getStage(userId);
  if (!currnetStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currnetStages.sort((a, b) => a.id - b.id);
  const currentStage = currnetStages[currnetStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 점수 검증 로직
  // 현재 타임 스탬프ㄹ
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 1스테이지 -> 2스테이지 넘어가는
  // 5 => 임의로 정한 오차범위
  if (elapsedTime < 100 || elapsedTime > 105) {
    return { status: 'fail', message: 'Invalid elapsed Time' };
  }

  // targetStage 대한 검증 <- 게임 에셋에 존재하는 스테이지인가?
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);

  return { status: 'success', message: `Stage moved to ${payload.targetStage}` };
};
