const getInstagramUrl = require("./lib/getInstagramUrl")
const {
  router,
  text
} = require('bottender/router');

async function Greeting(context) {
  const GREETING_MSG = `嗨！歡迎來到 JingRu，一起享受歡樂的遊戲時光吧！輸入 help 查看說明。`;

  await context.sendText(GREETING_MSG);
}

async function Help(context) {
  const msg = `說明：
- 猜數字：輸入「猜數字」進行遊戲。
- 比大小：輸入「比大小 N」來開始遊戲，N 預設是 2，可以不設定。輪流輸入「骰」來取得點數。
- 抽：輸入「抽」來隨機出現圖片
- 抽正妹
- 抽星座
- 抽美食
- BTS：輸入「BTS」來取得 BTS 照片。
`;
  await context.sendText(msg);
}

async function GuessNumber(context) {
  await context.sendText('遊戲開始！輸入四個數字來猜！');
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
  // if (num.length != 4) {
  //   await context.sendText('必須是四個數字！');
  //   return;
  // }
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

  if (a == 4) {
    const user = await context.getUserProfile();
    const name = user.displayName;

    let state = context.state;
    state.number = {
      start: false,
    };
    context.setState(state);
    await context.sendText(`Bingo！${name} 猜對了！`);
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

  if (a == 5) {
    const user = await context.getUserProfile();
    const name = user.displayName;

    let state = context.state;
    state.number = {
      start: false,
    };
    context.setState(state);
    await context.sendText(`Bingo！${name} 猜對了！`);
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

  const user = await context.getUserProfile();
  state.roll.result.push({
    name: user.displayName,
    number: number
  });

  let reply = `${user.displayName} 骰出 ${number}\n`;

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
  await context.replyImage({
    originalContentUrl: url,
    previewImageUrl: url,
  });
}

async function DrawBTS(context) {
  const url = await getInstagramUrl("bts");
  await context.replyImage({
    originalContentUrl: url,
    previewImageUrl: url,
  });
}

async function DrawGirl(context) {
  const url = await getInstagramUrl("girl");
  await context.replyImage({
    originalContentUrl: url,
    previewImageUrl: url,
  });
}

async function DrawConstellation(context) {
  const url = await getInstagramUrl("constellation");
  await context.replyImage({
    originalContentUrl: url,
    previewImageUrl: url,
  });
}

async function DrawFood(context) {
  const url = await getInstagramUrl("food");
  await context.replyImage({
    originalContentUrl: url,
    previewImageUrl: url,
  });
}


module.exports = async function App(context) {
  if (context.event.isFollow || context.event.isJoin) {
    return Greeting;
  }

  return router([
    text(/^h(ello|i)|^\/start/i, Greeting),
    text(/^help$/i, Help),
    text(/^比大小$/, Roller),
    text('骰', Roll),
    text(/^猜數字|guess$/i, GuessNumber),
    text(/^猜數字2|guess2$/i, GuessNumber2),
    text('答案', GuessNumberAnswer),
    text(/^\d{4}$/, Guess),
    text(/^(\d|[a-c]){5}$/, Guess2),
    text(/^抽$/, Draw),
    text(/^抽星座$/, DrawConstellation),
    text(/^抽(正妹|美女)$/, DrawGirl),
    text(/^抽美食$/, DrawFood),
    text(/^BTS$/, DrawBTS),
  ]);
};