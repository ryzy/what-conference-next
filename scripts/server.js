/**
 * Serving prepared compiled production builds from `dist/demo-app`.
 * Used to test production build.
 *
 * Usage:
 * * run `yarn build:demo-app:prod`
 * * run `yarn serve` and open the site on http://localhost:4404/
 */

const express = require('express');
const path = require('path');
const fallback = require('express-history-api-fallback');

const DIST_APP_ROOT_DIR = path.join(__dirname, '../', 'dist');
// console.log(DIST_DEMO_APP_ROOT_DIR);

const app = express();
app.use(express.static(DIST_APP_ROOT_DIR + '/app'));
app.use(fallback('index.html', { root: DIST_APP_ROOT_DIR + '/app' }));

app.listen(4104, function() {
  const port = this.address().port;
  console.log(`App server started on http://localhost:${port}/`);
});

const poc = express();
poc.use(express.static(DIST_APP_ROOT_DIR + '/poc'));
poc.use(fallback('index.html', { root: DIST_APP_ROOT_DIR + '/poc' }));

poc.listen(4105, function() {
  const port = this.address().port;
  console.log(`POC server started on http://localhost:${port}/`);
});
