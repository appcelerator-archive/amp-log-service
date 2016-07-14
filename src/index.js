// This is the default module for `dist` builds. It provides source mapping
// support for transpiled js.
// Don't load this module if using `babel-node` (or `npm run babel`) during
// development instead, load `src/app` directly.
require('source-map-support').install()
module.exports = require('./app')
