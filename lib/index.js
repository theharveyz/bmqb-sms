'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _smsers = require('./smsers');

var smsers = _interopRequireWildcard(_smsers);

var _http_client = require('./http_client');

var _http_client2 = _interopRequireDefault(_http_client);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class BmqbSms {
  constructor(_ref) {
    let smser = _ref.smser;
    var _ref$config = _ref.config;
    let config = _ref$config === undefined ? null : _ref$config;
    var _ref$debug = _ref.debug;
    let debug = _ref$debug === undefined ? false : _ref$debug;

    if (!config || !smser) {
      throw new Error('参数错误');
    }

    if (!smser in smsers) {
      throw new Error('smser not found!');
    }
    smser = _lodash2.default.upperFirst(smser.toLowerCase());
    return new smsers[smser](config, (0, _http_client2.default)(debug));
  }
}
exports.default = BmqbSms;