import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import './Socket.js';
import { sendEvent } from './Socket.js';
import { STATE } from './Constants.js';

import ITEM_UNLOCK from './assets/item_unlock.json' with { type: 'json' };
import SPECIAL_ITEM_UNLOCK from './assets/special_item_unlock.json' with { type: 'json' };
import SPECIAL_ITEM from './assets/special_item.json' with { type: 'json' };

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

// 게임 크기
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1.5; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// 땅
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_SPEED = 0.5;

// 선인장
const CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
  { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
  { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' },
];

// 아이템
const ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: 'images/items/pokeball_red.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: 'images/items/pokeball_yellow.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: 'images/items/pokeball_purple.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: 'images/items/pokeball_cyan.png' },
];

//특수 아이템
const SPECIAL_ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 51, image: 'images/items/flower.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 52, image: 'images/items/star.png' },
];

// 게임 요소들
let player = null;
let ground = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

let player_coords = [];

function loadImages(config) {
  return Promise.all(
    config.map((item) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = item.image;
        image.onload = () =>
          resolve({
            image,
            id: item.id,
            width: item.width * scaleRatio,
            height: item.height * scaleRatio,
          });
        image.onerror = reject;
      });
    }),
  );
}

async function createSprites() {
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 땅
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

  const cactiImages = await loadImages(CACTI_CONFIG);
  console.log('Cacti Images Loaded:', cactiImages);

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);
  console.log('CactiController Initialized:', cactiController);

  const itemImages = await loadImages(ITEM_CONFIG);

  const specialItemImages = await loadImages(SPECIAL_ITEM_CONFIG);

  itemController = new ItemController(
    ctx,
    itemImages,
    specialItemImages,
    scaleRatio,
    GROUND_SPEED,
    ITEM_UNLOCK,
    SPECIAL_ITEM_UNLOCK,
  );

  score = new Score(ctx, scaleRatio);
}

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
window.addEventListener('resize', setScreen);

if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y);
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText('Tap Screen or Press Space To Start', x, y);
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  player_coords = [];

  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  sendEvent(2, { timestamp: Date.now() });
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (!cactiController || !itemController || !player) {
    console.warn('Game objects not initialized yet');
    requestAnimationFrame(gameLoop);
    return;
  }

  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameover && !waitingToStart) {
    // 현재 시간이 blockEndTime을 초과했는지 확인
    if (STATE.ISBLOCK && STATE.blockEndTime) {
      if (Date.now() > STATE.blockEndTime) {
        console.log('특수 아이템 효과 종료');
        STATE.ISBLOCK = false;
        STATE.blockEndTime = null; // 종료 시간 초기화
      }
    }

    // update
    // 땅이 움직임
    ground.update(gameSpeed, deltaTime);
    // 선인장
    cactiController.update(gameSpeed, deltaTime);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime);
    updateGameSpeed(deltaTime);

    score.update(deltaTime, itemController);
  }

  //충돌 처리
  if (!gameover && cactiController.collideWith(player)) {
    if (STATE.ISBLOCK) {
      console.log('특수 아이템 효과로 충돌 무시!');
      //아이템을 먹은 시간을 추출 하고 아이템의 duration값을 계산
      //서버 시간
    } else {
      console.log('충돌 발생: 게임오버');
      gameover = true;
      score.setHighScore(player_coords);
      setupGameReset();
    }
  }

  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem) {
    const { itemId, itemType, timeStamp } = collideWithItem;

    if (itemType === 'special') {
      // 특수 아이템 지속 시간 설정
      const specialItem = SPECIAL_ITEM.data.find((item) => item.id === itemId);
      if (specialItem) {
        STATE.ISBLOCK = true;
        STATE.blockEndTime = timeStamp + specialItem.duration * 1000;
        console.log('blockEndTime 설정:', new Date(STATE.blockEndTime));
      }
    } else if (itemType === 'normal') {
      console.log('일반 아이템 충돌! itemId:', itemId);
      // 일반 아이템 점수 처리
    }

    // 아이템 점수/효과 처리
    score.getItem(itemId);
  }

  // draw
  player.draw();
  cactiController.draw();
  ground.draw();
  score.draw();
  itemController.draw();

  if (gameover) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

window.addEventListener('keyup', reset, { once: true });
