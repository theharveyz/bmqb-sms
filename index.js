var fs = require('fs');
var path = require('path');
try{
  fs.accessSync(path.join('./lib/', 'index.js'), fs.constants.R_OK);
  
  // 兼容新的接口
  require('babel-polyfill');

  exports = module.exports = require('./lib');
} catch (e) {
  exports = module.exports = require('./src');
}
