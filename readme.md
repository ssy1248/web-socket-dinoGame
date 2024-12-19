# 웹소켓 게임 만들기

## 파일 구조
```txt
Project Root
├── public (Client)
│   ├── assets
│   │   ├── item.json
│   │   ├── item_unlock.json
│   │   ├── special_item.json
│   │   ├── special_item_unlock.json
│   │   ├── stage.json
│   ├── images
│   │   ├── CactiController.js
│   │   ├── Cactus.js
│   │   ├── Constants.js
│   │   ├── Ground.js
│   │   ├── ItemController.js
│   │   ├── Player.js
│   │   ├── Score.js
│   │   ├── Socket.js
│   ├── index.html
│   ├── index.js
│   ├── style.css
│
├── src (Server)
│   ├── handlers
│   │   ├── game.handler.js
│   │   ├── handlerMapping.js
│   │   ├── helper.js
│   │   ├── item.handler.js
│   │   ├── rank.handler.js
│   │   ├── register.handler.js
│   │   ├── stage.handler.js
│   ├── init
│   │   ├── assets.js
│   │   ├── redis.js
│   │   ├── socket.js
│   ├── models
│   │   ├── itemLog.model.js
│   │   ├── rank.model.js
│   │   ├── stage.model.js
│   │   ├── user.model.js
│   ├── app.js
│   ├── constants.js
```

---------------------------------------

## JSON 파일 구조조

### stage.json
```js
{
  "name": "stage",
  "version": "1.0.0",
  "data": [
    { "id":  1000, "score": 0, "scorePerSecond": 1 },
    { "id":  1001, "score": 30, "scorePerSecond": 2 },
    { "id":  1002, "score": 60, "scorePerSecond": 4 },
    { "id":  1003, "score": 180, "scorePerSecond": 8 },
    { "id":  1004, "score": 360, "scorePerSecond": 16 },
    { "id":  1005, "score": 720, "scorePerSecond": 32 },
    { "id":  1006, "score": 1440, "scorePerSecond": 64 },
    { "id":  1007, "score": 2880, "scorePerSecond": 128 },
    { "id":  1008, "score": 5760, "scorePerSecond": 256 },
    { "id":  1009, "score": 11500, "scorePerSecond": 512 }
  ]
}
```

### item.json
```js
{
  "name": "item",
  "version": "1.0.0",
  "data": [
    { "id": 1, "score": 10, "type": "normal" },
    { "id": 2, "score": 20, "type": "normal" },
    { "id": 3, "score": 30, "type": "normal" },
    { "id": 4, "score": 40, "type": "normal" },
    { "id": 5, "score": 50, "type": "normal" },
    { "id": 6, "score": 60, "type": "normal" }
  ]
}
```

### item_unlock.json
```js
{
  "name": "item_unlock",
  "version": "1.0.0",
  "data": [
    { "id":  101, "stage_id": 1001, "item_id": [1] },
    { "id":  201, "stage_id": 1002, "item_id": [1] },
    { "id":  301, "stage_id": 1003, "item_id": [1, 2] },
    { "id":  401, "stage_id": 1004, "item_id": [1, 2, 3] },
    { "id":  501, "stage_id": 1005, "item_id": [2, 3] },
    { "id":  601, "stage_id": 1006, "item_id": [2, 3, 4] },
    { "id":  701, "stage_id": 1007, "item_id": [3, 4] },
    { "id":  801, "stage_id": 1008, "item_id": [3, 4, 5] },
    { "id":  901, "stage_id": 1009, "item_id": [5, 6] }
  ]
}
```

### special_item.json
```js
{
    "name": "special_item",
    "version": "1.0.0",
    "data": [
    {
      "id": 51,
      "type": "special",
      "name": "damage_shield",
      "description": "Grants invincibility for a limited 3 time",
      "duration": 3
    },
    {
      "id": 52,
      "type": "special",
      "name": "invincibility",
      "description": "Grants invincibility for a limited 5 time",
      "duration": 5
    }
  ]
}
```

### special_item_unlock.json
```js
{
    "name": "special_item_unlock",
    "version": "1.0.0",
    "data": [
      { "id":  102, "stage_id": 1001, "special_item_id": [51] },
      { "id":  202, "stage_id": 1002, "special_item_id": [51] },
      { "id":  302, "stage_id": 1003, "special_item_id": [51] },
      { "id":  402, "stage_id": 1004, "special_item_id": [51, 52] },
      { "id":  502, "stage_id": 1005, "special_item_id": [51, 52] },
      { "id":  602, "stage_id": 1006, "special_item_id": [51, 52] },
      { "id":  702, "stage_id": 1007, "special_item_id": [51, 52] },
      { "id":  802, "stage_id": 1008, "special_item_id": [52] },
      { "id":  902, "stage_id": 1009, "special_item_id": [52] }
    ]
}
```