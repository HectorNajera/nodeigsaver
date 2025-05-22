// const serverless = require('serverless-http');
// const app = require('./index');
//
// module.exports.handler = serverless(app);
const serverless = require('serverless-http');
module.exports.handler = serverless(app);
