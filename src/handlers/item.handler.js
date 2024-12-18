import { getGameAssets } from '../init/assets.js';
import { getItemLog, setItemLog } from '../models/itemLog.model.js';

//아이템 획득에 따른 핸들러
export const getItemHandler = async (userId, payload) => {
  console.log('getItemHandler =>>>> ', userId, payload);

  // 유저의 현재 아이템 이력 정보
  let currentItemLog = await getItemLog(userId);

  if (!currentItemLog) {
    return { status: 'fail', message: '아이템 이력 없음 ' };
  }

  // 오름차순 정렬
  currentItemLog.sort((a, b) => a.timestamp - b.timestamp);
  const lastItemLog = currentItemLog[currentItemLog.length - 1];

  if (lastItemLog) {
    if (Math.abs((payload.timestamp - lastItemLog.timestamp) / 1000) < 3) {
      return { status: 'fail', message: 'player Error' };
    }
  }

  const { itemUnlocks } = getGameAssets();
  const currentStageData = itemUnlocks.data.find((e) => e.stage_id === payload.currentStageId);

  if (!currentStageData) {
    return { status: 'fail', message: '잘못된 획득 아이템 스테이지 정보' };
  } else if (!currentStageData.item_id.includes(payload.itemId)) {
    return { status: 'fail', message: '해당 스테이지에서 얻을 수 없는 아이템 정보' };
  }

  // 아이템 이력 저장
  setItemLog(userId, payload.currentStageId, payload.itemId, payload.itemScore, payload.timestamp);

  return { status: 'success', message: `get Item ${payload.itemId} +${payload.itemScore}` };
};

export const getSpecialItemHandler = async (userId, payload) => {
  
  return { status: 'success', message: `Get Special Item ${payload.specialItemId} +${payload.specialItemScore}` };
};
