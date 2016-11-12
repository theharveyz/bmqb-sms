import _ from 'lodash';
import moment from 'moment';
import SmserAbstract from './abstract';
import { md5 } from '../utils';
import SmsResponse from '../sms_response';
import { InvalidArgumentException } from '../exceptions';

export default class Boshitong extends SmserAbstract {
  static fetchBatchId(str) {
    let newStr = str;
    if (newStr && (typeof newStr === 'number')) {
      newStr = `${newStr}`;
    }
    if (newStr && !(typeof newStr === 'string')) {
      throw new InvalidArgumentException('Response must be a String');
    }

    if (newStr) {
      // 如果发送成功的话，则返回内容为：`0,{批次号}`
      const reg = /^0,(.*)$/;
      const matches = newStr.match(reg);
      if (matches instanceof Array && matches.length === 2) {
        return matches[1];
      }
    }
    // 自定义批次号，确保批次号一定存在
    return null;
  }

  static genCustomBatchId() {
    return moment().format('YYYYMMDDHHmmss') + new Date().getMilliseconds();
  }

  autoSignContext(str) {
    let con = str;
    if (con && (con.startsWith(this.config.sign) || con.endsWith(this.config.sign))) {
      con = _.trim(con, this.config.sign);
    }
    return this.config.sign + con;
  }

  constructor(config, request) {
    super({
      domain: null,
      uid: null,
      pwd: null,
      srcphone: null,
      sign: null, // 必需
    });
    this.setConfig(config);
    this.request = request;
  }

  sendVcode(mobile, msg) {
    return this.sendSms(mobile, msg);
  }

  sendSms(mobile, msg) {
    if (!msg || !mobile) {
      throw new InvalidArgumentException('Please specify params: mobile and msg!');
    }

    return this.send('/cmppweb/sendsms', {
      mobile,
      msg: encodeURI(this.autoSignContext(msg)),
    }).then(res => {
      const batchId = Boshitong.fetchBatchId(res);
      return new SmsResponse({
        ssid: batchId || Boshitong.genCustomBatchId(),
        status: batchId ? 'success' : 'failed',
        body: res,
      });
    });
  }

  sendPkg(pkg) {
    if (!_.isArray(pkg) || !pkg.length) {
      throw new InvalidArgumentException('Invalid format: pkg!');
    }
    if (pkg.length > 1000) {
      throw new InvalidArgumentException('Every time may not be sent more than 1000 msg');
    }
    const newPkg = pkg.map(ctx => {
      const context = encodeURI(this.autoSignContext(ctx.context));
      return {
        phone: ctx.phone,
        context,
      };
    });
    return this.send('/cmppweb/sendsmspkg', {
      msg: JSON.stringify(newPkg),
    }).then(res => {
      const batchId = Boshitong.fetchBatchId(res);
      return new SmsResponse({
        ssid: batchId || Boshitong.genCustomBatchId(),
        status: batchId ? 'success' : 'failed',
        body: res,
      });
    });
  }

  send(api, data) {
    const form = {
      uid: this.config.uid,
      pwd: md5(this.config.pwd),
      srcphone: this.config.srcphone,
    };
    Object.assign(form, data);

    return this.request({
      url: this.config.domain + api,
      method: 'POST',
      form,
      timeout: 10000,
    });
  }

}
