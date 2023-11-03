import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { environment } from 'src/environments/environment';
import { EnvConfig } from 'src/environments/utils';
import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export const app = (lang: string): express.Express => {
  const server = express();
  const distFolder = join(process.cwd(), `dist/angular-app/browser/${lang}`);
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // i18n stuff
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      providers: [
        {
          provide: LOCALE_ID,
          useValue: lang,
        },
      ],
    }),
  );

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    }),
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    }),
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
};

const run = (): void => {
  const port = process.env['PORT'] ?? 4000;

  const appPt = app('pt');
  const appEn = app('en-US');
  const server = express();
  server.use('/pt', appPt);
  server.use('/en-US', appEn);
  server.use('', appPt);
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
};

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule?.filename ?? '';
if (
  (environment.configuration !== EnvConfig.production && moduleFilename === __filename) ||
  moduleFilename.includes('iisnode')
) {
  run();
}

export * from './src/main.server';
