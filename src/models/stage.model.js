//ket: uuid value : array
const stages = {};

//스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
};

export const getStage = (uuid) => {
  return stages[uuid];
};

//시작을 할때 시간도 받아야 하므로 setStage를 실행하면 timestamp도 전송
export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
