const getInstagramUrl = require("./lib/getInstagramUrl")
const {
  router,
  text
} = require('bottender/router');

async function Greeting(context) {
  const GREETING_MSG = `嗨！歡迎來到「安琪兒」，一起享受歡樂的遊戲時光吧！輸入 help 查看說明。`;

  await context.sendText(GREETING_MSG);
}

let test_id = true;
async function UserName(context) {
  if (context.platform == "console") {
    test_id = !test_id;
    return `tester_${test_id}`;
  }
  const user = await context.getUserProfile();
  return user.displayName;
}

async function Help(context) {
  const msg = `輸入以下指令（括弧為縮寫指令）：
- 五子棋(/a)
- 猜數字(/g)：1A2B
- 猜數字2(/g2)：1A2B 強化版
- 劃圈圈(/c)：
  輪流劃掉圈圈
  每次劃掉連續直線的 1~3 個圈圈
  最後劃的人輸
  輸入方法為 "del xy xy xy"
  其中 xy 為座標，中間格一個空格。
  例如輸入 "del 33 44"、"del 11 12 13"。
- 比大小：2 個人輪流輸入「骰」來取得點數
- 比大小 N：
  N 為數字，N 個人輪流輸入「骰」來取得點數
- 抽：隨機出現圖片
- 抽正妹：隨機正妹
- 抽星座：隨機星運圖
- 抽美食：隨機美食
- BTS：隨機取得 BTS 照片
- /info：取得更多資訊 
`;
  await context.sendText(msg);
}

async function replyImageHelper(context, url) {
  if (context.platform == "line") {
    await context.replyImage({
      originalContentUrl: url,
      previewImageUrl: url,
    });
  } else if (context.platform == "telegram") {
    await context.sendPhoto(url);
  }
}

function printCircleBoard(circle) {
  let circle_board_print = "";
  const size = circle.size;
  const board = circle.board;
  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
      if (i == 0 && j == 0) {
        circle_board_print += "　 ";
      } else if (i == 0) {
        circle_board_print += String.fromCharCode(j + 48 + 65248) + " ";
      } else if (j == 0) {
        circle_board_print += String.fromCharCode(i + 48 + 65248) + " ";
      } else {
        if ((1 << (((i - 1) * size + j) - 1)) & board) {
          circle_board_print += '● ';
        } else {
          circle_board_print += '○ ';
        }
      }
      if (j == size) {
        circle_board_print += '\n';
      }
    }
  }
  return circle_board_print;
}

function printGobangBoard(c) {
  let board_print = "";
  const size = c.size;
  const board = c.board;
  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
      if (i == 0 && j == 0) {
        board_print += "   ";
      } else if (i == 0) {
        board_print += j + "  ";
      } else if (j == 0) {
        board_print += i + " ";
      } else {
        const x = i - 1;
        const y = j - 1;
        if (board[x][y] == 1) {
          board_print += '● ';
        } else if (board[x][y] == -1) {
          board_print += '⊗ ';
        } else {
          board_print += '○ ';
        }
      }
      if (j == size) {
        board_print += '\n';
      }
    }
  }
  return board_print;
}

function checkGobangWin(board, x, y) {
  const player = board[x][y];
  const size = board[0].length;

  let counter = 1;
  let x_ = x;
  let y_ = y;

  --x_;
  while (x_ >= 0 && x_ < size && board[x_][y] == player) {
    counter++;
    --x;
  }
  x_ = x;
  ++x_;
  while (x_ >= 0 && x_ < size && board[x_][y] == player) {
    counter++;
    ++x_;
  }
  if (counter >= 5) {
    return true;
  }

  counter = 1;
  y_ = y;
  --y_;
  while (y_ >= 0 && y_ < size && board[x][y_] == player) {
    counter++;
    --y_;
  }
  y_ = y;
  ++y_;
  while (y_ >= 0 && y_ < size && board[x][y_] == player) {
    counter++;
    ++y_;
  }
  if (counter >= 5) {
    return true;
  }

  counter = 1;
  x_ = x;
  y_ = y;
  --x_;
  --y_;
  while (x_ >= 0 && x_ < size && y_ >= 0 && y_ < size && board[x_][y_] == player) {
    counter++;
    --x_;
    --y_;
  }
  x_ = x;
  y_ = y;
  ++x_;
  ++y_;
  while (x_ >= 0 && x_ < size && y_ >= 0 && y_ < size && board[x_][y_] == player) {
    counter++;
    ++x_;
    ++y_;
  }
  if (counter >= 5) {
    return true;
  }

  counter = 1;
  x_ = x;
  y_ = y;
  --x_;
  ++y_;
  while (x_ >= 0 && x_ < size && y_ >= 0 && y_ < size && board[x_][y_] == player) {
    counter++;
    --x_;
    ++y_;
  }
  x_ = x;
  y_ = y;
  ++x_;
  --y_;
  while (x_ >= 0 && x_ < size && y_ >= 0 && y_ < size && board[x_][y_] == player) {
    counter++;
    ++x_;
    --y_;
  }
  if (counter >= 5) {
    return true;
  }

  return false;
}

async function Gobang(context) {
  const size = 9;
  const board = [];
  for (let i = 0; i < size; i++) {
    board.push(Array(size).fill(0));
  }
  context.state.gobang = {
    start: true,
    size: size,
    board: board,
    players: [],
    lastPlayer: "",
  };
  const gobang_board_print = printGobangBoard(context.state.gobang);
  const msg = `遊戲開始！輸入座標來下子！（例如：「@3 4」代表下在橫 3 縱 4 之位置）\n` + gobang_board_print;
  await context.sendText(msg);
}

async function PlayGobang(context) {
  const gobang = context.state.gobang;

  if (!gobang.start) {
    await context.sendText("目前無棋局！");
    return;
  }

  const input = context.event.text;
  const x = Number(input.slice(1).split(" ")[0]) - 1;
  const y = Number(input.slice(1).split(" ")[1]) - 1;

  if (x < 0 || y < 0 || x >= gobang.size || y >= gobang.size) {
    await context.sendText("不合法位置");
    return;
  }
  if (gobang.board[x][y] != 0) {
    await context.sendText("已經下過了");
    return;
  }

  const name = await UserName(context);
  if (gobang.players.length == 0) {
    gobang.players.push(name);
  } else if (gobang.players.length == 1) {
    if (gobang.players[0] == name) {
      await context.sendText("第二人需為不同人");
      return;
    }
    gobang.players.push(name);
  }

  const player = (name == gobang.players[0]) ? 1 : (name == gobang.players[1]) ? -1 : 0;
  if (player == 0) {
    await context.sendText("非參賽選手，如需更改選手，請重新開局");
    return;
  }
  if (name == gobang.lastPlayer) {
    await context.sendText("還沒輪到你唷！");
    return;
  }
  gobang.lastPlayer = name;

  gobang.board[x][y] = player;

  if (checkGobangWin(gobang.board, x, y)) {
    gobang.start = false;
    await context.sendText(`${await UserName(context)} 贏了！`);
    return;
  };

  const gobang_board_print = printGobangBoard(context.state.gobang);
  await context.sendText(gobang_board_print);
}

async function Circle(context) {
  const size = 5;
  const board = 0;
  context.state.circle = {
    start: true,
    size: size,
    board: board,
  };

  const circle_board_print = printCircleBoard(context.state.circle);
  const msg = `遊戲開始！輸入座標劃掉至多三個連續圈圈！（例如：「del 11 12 13」）\n` + circle_board_print;
  await context.sendText(msg);
}

async function DeleteCircle(context) {
  const circle = context.state.circle;

  if (!circle.start) {
    await context.sendText("輸入「劃圈圈」來開始遊戲！");
    return;
  }

  const args = context.event.text.slice(4);
  const ps = args.split(" ");

  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    if (p[0] > circle.size || p[0] == 0 || p[1] > circle.size || p[1] == 0) {
      await context.sendText("座標錯誤，請重新輸入");
      return;
    }
  }

  if (ps.length > 3) {
    await context.sendText("最多三個圈圈，請重新輸入");
    return;
  } else if (ps.length == 3) {
    let flag = 0;
    const dx = ps[1][0] - ps[0][0];
    if (ps[2][0] - ps[1][0] != dx) {
      flag = 1;
    }

    const dy = ps[1][1] - ps[0][1];
    if (ps[2][1] - ps[1][1] != dy) {
      flag = 1;
    }

    if (ps[0] == ps[1] || ps[1] == ps[2] || ps[0] == ps[2]) {
      flag = 1;
    }

    if (flag) {
      await context.sendText("必須是連續直線（橫縱斜），請重新輸入");
      return;
    }
  } else if (ps.length == 2) {
    let flag = 0;
    const dx = ps[1][0] - ps[0][0];
    if (dx != 1 && dx != 0 && dx != -1) {
      flag = 1;
    }

    const dy = ps[1][1] - ps[0][1];
    if (dy != 1 && dy != 0 && dy != -1) {
      flag = 1;
    }

    if (ps[0] == ps[1]) {
      flag = 1;
    }

    if (flag) {
      await context.sendText("必須是連續直線（橫縱斜），請重新輸入");
      return;
    }
  }

  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    const x = Number(p[0]);
    const y = Number(p[1]);
    const k = ((y - 1) * circle.size + x) - 1;
    if (1 << k & circle.board) {
      await context.sendText("座標重複，請重新輸入");
      return;
    }
  }
  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    const x = Number(p[0]);
    const y = Number(p[1]);
    const k = ((y - 1) * circle.size + x) - 1;
    circle.board |= 1 << k;
  }

  if (circle.board == (1 << circle.size * circle.size) - 1) {
    context.state.circle.start = false;
    await context.sendText(`遊戲結束！${await UserName(context)} 輸了！`);
    return;
  }

  const msg = printCircleBoard(circle);
  await context.sendText(msg);
}

async function GuessNumber(context) {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let i = Math.floor((Math.random() * arr.length));
  const random1 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random2 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random3 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random4 = arr[i];
  arr.splice(i, 1);

  let state = context.state;
  state.number = {
    start: true,
    type: 1,
    counter: 0,
    answer: `${random1}${random2}${random3}${random4}`
  };
  context.setState(state);
  await context.sendText('遊戲開始！輸入四個數字來猜！');
}

async function GuessNumber2(context) {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c'];
  let i = Math.floor((Math.random() * arr.length));
  const random1 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random2 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random3 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random4 = arr[i];
  arr.splice(i, 1);
  i = Math.floor((Math.random() * arr.length));
  const random5 = arr[i];
  arr.splice(i, 1);

  let state = context.state;
  state.number = {
    start: true,
    type: 2,
    counter: 0,
    answer: `${random1}${random2}${random3}${random4}${random5}`
  };
  context.setState(state);
  await context.sendText('遊戲開始！輸入五個數字（0-9）加字母（a-c)來猜！例如: 13ac5');
}

async function GuessNumberAnswer(context) {
  await context.sendText(context.state.number.answer);
}

async function Guess(context) {
  if (context.state.number.type == 2) {
    await context.sendText('模式為「猜數字2」，輸入 5 個數字或字母！');
    return;
  }
  if (!context.state.number.start) {
    await context.sendText('輸入「猜數字」開始！');
    return;
  }
  const answer = context.state.number.answer;

  const num = context.event.text;

  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (num[i] == num[j]) {
        await context.sendText('必須是四個「相異」數字！');
        return;
      }
    }
  }
  let a = 0;
  let b = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (num[i] == answer[j]) {
        if (i == j) a++;
        else b++;
      }
    }
  }

  context.state.number.counter++;

  if (a == 4) {
    const name = await UserName(context);
    const counter = context.state.number.counter;

    let state = context.state;
    state.number = {
      start: false,
    };
    context.setState(state);
    await context.sendText(`Bingo！${name} 猜對了！共猜了 ${counter} 次。`);
  } else {
    await context.sendText(`${a} A ${b} B`);
  }
}

async function Guess2(context) {
  if (context.state.number.type == 1) {
    await context.sendText('模式為「猜數字」，輸入 4 個數字！');
    return;
  }
  if (!context.state.number.start) {
    await context.sendText('輸入「猜數字2」開始！');
    return;
  }
  const answer = context.state.number.answer;

  const num = context.event.text;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (num[i] == num[j]) {
        await context.sendText('必須是 5 個「相異」數字或字母！');
        return;
      }
    }
  }
  let a = 0;
  let b = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (num[i] == answer[j]) {
        if (i == j) a++;
        else b++;
      }
    }
  }

  context.state.number.counter++;

  if (a == 5) {
    const name = await UserName(context);
    const counter = context.state.number.counter;

    let state = context.state;
    state.number = {
      start: false,
    };
    context.setState(state);
    await context.sendText(`Bingo！${name} 猜對了！共猜了 ${counter} 次。`);
  } else {
    await context.sendText(`${a} A ${b} B`);
  }
}


async function Roller(context) {
  const isInteger = value => parseInt(value) == value;
  const p = Number(context.event.text.split(" ")[1]);
  const people = isInteger(p) ? p : 2;

  let state = context.state;
  state.roll = {
    start: true,
    result: [],
    people: people
  };
  context.setState(state);

  await context.sendText('每個人輪流輸入「骰」來取得點數！');
}
async function Roll(context) {
  let state = context.state;
  if (!state.roll.start) {
    await context.sendText('輸入「比大小」來開始！');
    return;
  }

  const number = Math.floor((Math.random() * 100) + 1);

  const name = await UserName(context);
  state.roll.result.push({
    name: name,
    number: number
  });

  let reply = `${name} 骰出 ${number}\n`;

  if (state.roll.result.length == state.roll.people) {
    let id = 0;
    for (let i = 0; i < state.roll.result.length; i++) {
      if (state.roll.result[id].number < state.roll.result[i].number) {
        id = i;
      }
    }
    const winner = state.roll.result[id];
    context.setState({
      roll: {
        start: true,
        result: [],
        people: 2
      }
    });
    state.roll = {};
    context.setState(state);
    reply += `結果：${winner.name} 贏了！\n`;
  }

  await context.sendText(reply);
}

async function Draw(context) {
  const url = await getInstagramUrl("");
  await replyImageHelper(context, url);
}

async function DrawBTS(context) {
  const url = await getInstagramUrl("bts");
  await replyImageHelper(context, url);
}

async function DrawGirl(context) {
  const url = await getInstagramUrl("girl");
  await replyImageHelper(context, url);
}

async function DrawConstellation(context) {
  const url = await getInstagramUrl("constellation");
  await replyImageHelper(context, url);
}

async function DrawFood(context) {
  const url = await getInstagramUrl("food");
  await replyImageHelper(context, url);
}

async function Info(context) {
  await context.sendText("https://github.com/tigercosmos/angel");
}

module.exports = async function App(context) {
  if (context.event.isFollow || context.event.isJoin) {
    return Greeting;
  }

  return router([
    text(/^h(ello|i)|^\/start/i, Greeting),
    text(/^help$/i, Help),
    text(/^(五子棋|\/a)$/, Gobang),
    text(/^@(\d){1,2}\s(\d){1,2}$/, PlayGobang),
    text(/^(劃圈圈|\/c)$/, Circle),
    text(/^del/, DeleteCircle),
    text(/^比大小/, Roller),
    text('骰', Roll),
    text(/^(猜數字|\/g)$/, GuessNumber),
    text(/^(猜數字2|\/g2)$/, GuessNumber2),
    text('答案', GuessNumberAnswer),
    text(/^\d{4}$/, Guess),
    text(/^(\d|[a-c]){5}$/, Guess2),
    text(/^抽$/, Draw),
    text(/^抽星座$/, DrawConstellation),
    text(/^抽(正妹|美女)$/, DrawGirl),
    text(/^抽美食$/, DrawFood),
    text(/^BTS$/, DrawBTS),
    text(/^\/info$/, Info),
  ]);
};