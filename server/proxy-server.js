const express = require('express');
const path = require('path');

const getTranslatedServer = lang => {
  const distFolder = path.join(process.cwd(), `dist/angular-app/server/${lang}`);
  const server = require(`${distFolder}/main.js`);
  return server.app(lang);
};

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const appPt = getTranslatedServer('pt');
  const appEn = getTranslatedServer('en-US');

  const server = express();
  server.use('/pt', appPt);
  server.use('/en-US', appEn);
  server.use('', appPt);

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
