import { gameEnd, gameStart } from './game.handler.js';
import { moveStageHandler } from './stage.handler.js';
import { updateHighScore } from './rank.hanlder.js';
import { getItemHandler, getSpecialItemHandler } from './item.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  12: getItemHandler,
  13: getSpecialItemHandler,
  99: updateHighScore,
};

export default handlerMappings;
