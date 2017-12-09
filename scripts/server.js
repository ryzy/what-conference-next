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
app.use(express.static(DIST_APP_ROOT_DIR));
app.use(fallback('index.html', { root: DIST_APP_ROOT_DIR }));

app.listen(4104, function() {
  const port = this.address().port;
  console.log(`Server started on http://localhost:${port}/`);
});
