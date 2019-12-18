const {
  withProps
} = require('bottender');
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
`;
  await context.sendText(msg);
}

async function GuessNumber(context) {
  await context.sendText('遊戲開始！輸入四個數字來猜！');
}

async function Roller(context) {
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

module.exports = async function App(context) {
  if (context.event.isFollow || context.event.isJoin) {
    return Greeting;
  }

  return router([
    text(/^h(ello|i)|^\/start/i, Greeting),
    text(/^help/i, Help),
    text(/^比大小/, Roller),
    text('骰', Roll),
    text('猜數字', GuessNumber),
  ]);
};