import _ from 'lodash';
import moment from 'moment';
import SmserAbstract from './abstract';
import { encodeBase64Url } from '../utils';
import { InvalidArgumentException } from '../exceptions';

export default class Wuxiantianli extends SmserAbstract {

  static getBatchId() {
    return moment().format('YYYYMMDDHHmmss') + new Date().getMilliseconds();
  }

  constructor(_config, request) {
    super({
      'service': null,
      'clientid': null,
      'password': null,
    });
    this.setConfig(_config);
    this.request = request;
  }

  sendVcode(mobile, msg) {
    if (!msg || !mobile) {
      throw new InvalidArgumentException('Please specify params: mobile and msg!');
    }

    if (!this.config.vcode_productid) {
      throw new InvalidArgumentException('Please specify the config param: vcode_productid!');
    }

    return this.send({
      'api': '/communication/sendSms.ashx', 
      'mobile': mobile, 
      'msg': msg, 
      'pid': this.config.vcode_productid,
    });    
  }

  sendSms(mobile, msg) {
    if (!msg || !mobile) {
      throw new InvalidArgumentException('Please specify params: mobile and msg!');
    }

    if (!this.config.productid) {
      throw new InvalidArgumentException('Please specify the config param: productid!');
    }

    return this.send({
      'api': '/communication/sendSms.ashx', 
      'mobile': mobile, 
      'msg': msg, 
      'pid': this.config.productid,
    });
  }

  /**
   * 无线天利不支持多人发送不同内容的短信
   */
  sendPkg(pkg) {
    if (!_.isArray(pkg) || !pkg.length) {
      throw new InvalidArgumentException('Invalid format: pkg!');
    }
    let [mobiles,msg] = [new Set(),''];
    pkg.map(p => {
      mobiles.add(p['phone']);
      msg = p['context'];
    });
    return this.sendSms(Array.from(mobiles).join(), msg);
  }

  send({api, mobile, content, pid}) {
    const batchId = Wuxiantianli.getBatchId();
    let queryData = {
      'content': encodeBase64Url(content),
      'mobile': encodeBase64Url(mobile),
      'productid': pid,
      'ssid': batchId,
      'lcode': '',
      'format': 32,
      'sign': '',
      'custom': '',  
    };

    Object.assign(queryData, {
      'cid': encodeBase64Url(this.config.clientid),
      'pwd': encodeBase64Url(this.config.password),
    });

    return this.request({
      'url': this.config.service + api,
      'method': 'GET',
      'headers': {
        'Accept': 'application/json'
      },
      'qs': queryData,
      'timeout': 10000,
      'useQuerystring': true
    }).then( body => {
      let status = 'failed'
      try {
        const _body = body instanceof String ? JSON.parse(body) : body;
        if (_body.status == '0') {
          status = 'success';
        }
      }catch(e){}
      return new SmsResponse({
        'ssid': batchId,
        'status': status,
        'body': body,
      });
    });
  }
}
