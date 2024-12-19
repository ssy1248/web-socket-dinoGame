# 웹소켓 게임 만들기

## 파일 구조
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

---------------------------------------

## JSON 파일 

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

### item_unlock.json

### special_item.json

### special_item_unlock.json