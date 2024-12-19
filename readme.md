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

---------------------------------------------------

## 필수 기능
### 스테이지 구분
stage.json에서 스테이지 구분을 하였습니다.

### 스테이지 따른 점수 획득 구분
stage.json에서 scorePerSecond를 사용하여서 이 값을 사용하여서 클라이언트의 Score.js에서의 update함수에서 점수를 획득을 합니다.

### 스테이지에 따라 아이템이 생성
item_unlock.json에서 스테이지에 배열에 풀릴 아이템 아이디들을 넣어놓고 그것을 클라이언트의 itemController.js에서의 createItem함수에서 스테이지 아이디와 현재 아이디를 비교하여서 아이템 사용

### 아이템 획득 시 점수 획득
item.json에 아이템 별로 점수를 만들어놨고 그것을 클라이언트의 Score.js에서 getItem을 할때 아이템의 아이디로 접근을 하여서 점수를 더해주고 그것을 서버로 전송합니다.

### 아이템 별 획득 점수 구분
4번 기능과 동일하게 item.json에 아이템 따라 점수를 달리 넣어놔서 그것을 아이디를 비교하여 점수를 더해준다.

## 도전 기능
### BroadCast 기능 추가
서버의 helper.js에서 기능을 추가했습니다.

### 가장 높은 점수 Record 관리
서버의 rank.hanlder.js에서 관리합니다.

### 유저 정보 연결
서버의 register.handler.js에서 uuid를 생성을 하여서 관리합니다.

### Redis 연동, 게임 정보 저장
서버의 redis.js에서 관리하고 push합니다.
