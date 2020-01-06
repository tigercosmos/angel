'use strict';
const getInstagramUrl = require('./lib/getInstagramUrl');

// ===== HTTP  =====
const http = require('http');
const express = require('express');
const app = express();

// ===== Require Packages ======
const bodyParser = require('body-parser');
const cors = require('cors');

// ===== Middleware =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

// ===== Image =====
app.get('/img', (req, res) => {
  const type = req.query.type;
  (async () => {
    const url = await getInstagramUrl(type);
    return res.status(200).json({
      url
    });
  })();
});

// ===== Front End =====
app.get('/', (req, res) => {
  res.send('Image service is working!');
});

// =====  Port =====
const httpServer = http.createServer(app);

// ===== Init Cache =====
(async () => {
  await getInstagramUrl("girl");
  await getInstagramUrl("food");
  await getInstagramUrl("constellation");
  await getInstagramUrl("bts");
  await getInstagramUrl("funny");

  httpServer.listen(13322);
})();