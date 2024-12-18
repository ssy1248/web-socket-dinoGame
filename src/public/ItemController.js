import Item from './Item.js';
import { FIRST_STAGE_ID } from './Constants.js';

class ItemController {
  INTERVAL_MIN = 3000;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  currentStageId = FIRST_STAGE_ID;
  itemUnlockData = null;

  constructor(ctx, itemImages, scaleRatio, speed, ITEM_UNLCOK) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.itemUnlockData = ITEM_UNLCOK.data;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    let stageItem = this.itemUnlockData.find((e) => e.stage_id === this.currentStageId);

    if (stageItem) {
      stageItem = stageItem.item_id;
      const itemImages = this.itemImages.filter((e) => stageItem.includes(e.id));
      const index = this.getRandomNumber(0, itemImages.length - 1);
      const itemInfo = itemImages[index];
      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

      const item = new Item(
        this.ctx,
        itemInfo.id,
        x,
        y,
        itemInfo.width,
        itemInfo.height,
        itemInfo.image,
      );

      this.items.push(item);
    }
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
    this.currentStageId = FIRST_STAGE_ID;
  }
}

export default ItemController;
