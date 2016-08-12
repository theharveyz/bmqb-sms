import SmserAbstract from './abstract';
import _ from 'lodash';
import rp from '../http_client';
import { md5 } from '../utils';

let config = {
  'domain': null,
  'uid': null,
  'pwd': null,
  'srcphone': null,
};

const REQ_CODES = {
  'ARGUMENTS_ERR': '-2',
  'VALIDATION_ERR': '-1', // 验证错误（ip地址未绑定等）
  'SRCPHONE_ERR': '7', // 长号错误
  'TRAFFIC_CTRL_ERR': '8', // 流量控制错误
  'OTHER_ERR': '9', //其他错误
  'BALANCE_LACK': '11', // 余额不足
};

export default class Boshitong extends SmserAbstract {
  constructor(_config, request) {
    super();
    Object.assign(config, _config);
    _.forEach(config, (v, k) => {
      if(!v){
        throw new Error('参数错误');
      }
    });

    config.pwd = md5(config.pwd);

    this.request = request;
  }

  sendSms(mobile, msg) {
    if(!msg || !mobile) {
      throw new Error('参数错误');
    }

    return this.request.post(
      `${config.domain}/cmppweb/sendsms`, {
        'form': {
          'uid': config.uid,
          'pwd': config.pwd,
          'srcphone': config.srcphone,
          'mobile': mobile,
          'msg': msg,
        }
      });
  }

  sendPkg(pkg) {
    if (!_.isArray(pkg) || !pkg.length) {
      throw new Error('参数错误');
    }
    return this.request.post(
      `${config.domain}/cmppweb/sendsmspkg`, {
        'form': {
          'uid': config.uid,
          'pwd': config.pwd,
          'srcphone': config.srcphone,
          'msg': pkg,
        }
      });    
  }
}
