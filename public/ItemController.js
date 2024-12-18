import Item from './Item.js';
import { FIRST_STAGE_ID } from './Constants.js';

class ItemController {
  INTERVAL_MIN = 3000;
  INTERVAL_MAX = 12000;

  SPECIAL_INTERVAL_MIN = 5000;
  SPECIAL_INTERVAL_MAX = 10000;

  nextInterval = null;
  nextSpecialInterval = null;
  items = [];
  specialItems = [];

  currentStageId = FIRST_STAGE_ID;
  itemUnlockData = null;
  specialItemUnlockData = null;

  constructor(
    ctx,
    itemImages,
    specialItemImages,
    scaleRatio,
    speed,
    ITEM_UNLCOK,
    SPECIAL_ITEM_UNLOCK,
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.specialItemImages = specialItemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.itemUnlockData = ITEM_UNLCOK.data;
    this.specialItemUnlockData = SPECIAL_ITEM_UNLOCK.data;

    this.setNextItemTime();
    this.setNextSpecialItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  setNextSpecialItemTime() {
    this.nextSpecialInterval = this.getRandomNumber(this.SPECIAL_INTERVAL_MIN, this.SPECIAL_INTERVAL_MAX);
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

  //특수 아이템? -> 점수를 크게 주는 것이 아닌 효과를 주는것인데데
  createSpecialItem() {
    let specialItem = this.specialItemUnlockData.find((e) => e.stage_id === this.currentStageId);

    if (specialItem) {
      specialItem = specialItem.special_item_id;
      const specialItemImages = this.specialItemImages.filter((e) => specialItem.includes(e.id));

      if (specialItemImages.length === 0) {
        console.warn('No matching special item images found');
        return;
      }

      const index =
        specialItemImages.length > 0 ? this.getRandomNumber(0, specialItemImages.length - 1) : 0;
      const itemInfo = specialItemImages[index];

      // itemInfo가 undefined인지 확인
      if (!itemInfo) {
        console.error('Item info is undefined for index:', index);
        return;
      }

      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

      const speciaItems = new Item(
        this.ctx,
        itemInfo.id,
        x,
        y,
        itemInfo.width,
        itemInfo.height,
        itemInfo.image,
      );

      this.specialItems.push(speciaItems);
    }
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }
    if (this.nextSpecialInterval <= 0) {
      this.createSpecialItem();
      this.setNextSpecialItemTime();
    }

    this.nextInterval -= deltaTime;
    this.nextSpecialInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.specialItems.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
    this.specialItems = this.specialItems.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
    this.specialItems.forEach((item) => item.draw());
  }

  //collideWith 함수 부분 수정
  collideWith(sprite) {
    // 일반 아이템 충돌 확인
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
        itemType: 'normal', // 일반 아이템
        timeStamp: Date.now(),
      };
    }

    // 특수 아이템 충돌 확인
    const collidedSpecialItem = this.specialItems.find((item) => item.collideWith(sprite));
    if (collidedSpecialItem) {
      this.ctx.clearRect(
        collidedSpecialItem.x,
        collidedSpecialItem.y,
        collidedSpecialItem.width,
        collidedSpecialItem.height,
      );
      return {
        itemId: collidedSpecialItem.id,
        itemType: 'special', // 특수 아이템
        timeStamp: Date.now(),
      };
    }
    return null;
  }

  reset() {
    this.items = [];
    this.currentStageId = FIRST_STAGE_ID;
  }
}

export default ItemController;
