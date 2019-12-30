const {
  initializeServer
} = require('bottender');
const minimist = require('minimist');
const getInstagramUrl = require("./lib/getInstagramUrl")

const argv = minimist(process.argv.slice(2));

const isConsole = argv.console;

if (isConsole) {
  initializeServer({
    isConsole
  });
} else {
  const server = initializeServer();

  // warm cache first
  (async () => {
    await getInstagramUrl("girl");
    await getInstagramUrl("food");
    await getInstagramUrl("constellation");

    const port = process.env.PORT || 8080;
    server.listen(port, () => {
      console.log(`server is listening on ${port} port...`);
    });
  })();
}