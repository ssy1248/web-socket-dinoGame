import { sendEvent } from './Socket.js';
import itemsData from './assets/item.json' with { type: 'json' };
import specialItemData from './assets/special_item.json' with { type: 'json' };
import stageData from './assets/stage.json' with { type: 'json' };
import { FIRST_STAGE_ID } from './Constants.js';

const stageDataArr = stageData.data.sort((a, b) => a.id - b.id);

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stage = 1;
  stageId = FIRST_STAGE_ID;

  constructor(ctx, scaleRatio, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime, itemController) {
    this.itemController = itemController;
    let currentStage = stageDataArr[this.stage];
    this.score += deltaTime * (0.001 * currentStage.scorePerSecond);

    // 스테이지 이동 로직
    if (this.stageChange && stageData && stageData.data && stageData.data.length > this.stage) {
      let targetStage = stageDataArr[this.stage + 1];
      if (Math.floor(this.score) > targetStage.score && this.stageChange) {
        this.stageChange = false;
        const res = sendEvent(11, {
          currentStage: currentStage.id,
          targetStage: targetStage.id,
          currentScore: Math.floor(this.score),
        });
        this.stage++;
        this.stageId = targetStage.id;
        this.itemController.currentStageId = targetStage.id;
        this.stageChange = true;
      }
    }
  }

  getItem(itemId) {
    const combinedItems = [
      ...itemsData.data.map((item) => ({ ...item, type: "normal" })),
      ...specialItemData.data.map((item) => ({ ...item, type: "special" })),
    ];

    console.log("Combined Items:", combinedItems);
    console.log("Received itemId:", itemId, typeof itemId);

    const foundItem = combinedItems.find((item) => item.id === Number(itemId));

    console.log("Get Item ", foundItem);

    if(!foundItem) {
      console.log("not found Item");
      return;
    } 

    if (foundItem.type === "special") {
      console.log("특수 아이템 획득: ", foundItem.description);
  
      sendEvent(12, {
        currentStageId: this.stageId,
        itemId: foundItem.id,
        itemType: foundItem.type,
        description: foundItem.description,
        duration: foundItem.duration,
        currentScore: this.score,
        timestamp: Date.now(),
      });
    } else if (foundItem.type === "normal") {
      this.score += foundItem.score;
  
      //sendEvent를 보낼 때 currentScore를 보내는 것이 아닌 itemId와 ItemType, itemScore를 보내서 서버에서 검사
      sendEvent(12, {
        currentStageId: this.stageId,
        itemId: foundItem.id,
        itemType: foundItem.type,
        itemScore: foundItem.score,
        currentScore: this.score,
        timestamp: Date.now(),
      });
  
      console.log("아이템 획득 ", foundItem.score);
    }
  }

  reset() {
    this.score = 0;
    this.stage = 0;
  }

  setHighScore(playerCoords) {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if(this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));

      sendEvent(99, {
        currentStageId: this.stageId,
        currentScore: this.score,
        playerCoords: playerCoords,
        timestamp: Date.now(),
      });
      return true;
    }
    return false;
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
