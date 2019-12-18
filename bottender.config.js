module.exports = {
  session: {
    driver: 'memory',
    expiresIn: 10, // 10 mins
    stores: {
      memory: {
        maxSize: 1000,
      }
    },
  },

  initialState: {
    roll: {},
  },

  channels: {
    messenger: {
      enabled: false,
      path: '/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
    },
    line: {
      enabled: true,
      path: '/line',
      accessToken: process.env.accessToken,
      channelSecret: process.env.channelSecret,
    },
    telegram: {
      enabled: true,
      path: '/telegram',
      accessToken: process.env.telegramAccessToken,
    },
  },
};
