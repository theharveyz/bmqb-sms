import _ from 'lodash';
import uuid from 'node-uuid';
import SmserAbstract from './abstract';
import { md5 } from '../utils';
import SmsResponse from '../sms_response';
import { InvalidArgumentException } from '../exceptions';

// 批量发送最大支持条数
const PKG_MAX_LEN = 500;
const STATUS_CODE = {
  success: '0',
};

export default class Dahansantong extends SmserAbstract {
  // msg-id格式例如：2c92825934837c4d0134837dcba00150
  // 32位小写
  static getMsgid() {
    let msgid = uuid.v4();
    msgid = _.join(_.split(msgid, '-'), '');
    return _.toLower(msgid);
  }

  static getSmsResponse(res, msgid) {
    let status = 'failed';
    if (res && res.msgid) {
      status = res.status === STATUS_CODE.success ? 'success' : status;
    }
    return new SmsResponse({
      ssid: msgid,
      status,
      body: res,
    });
  }

  constructor(config, request) {
    super({
      domain: null,
      account: null,
      password: null,
      subcode: null,
      sign: null,
    });
    this.setConfig(config);
    this.request = request;
  }

  // 签名要前置
  autoSignContext(str) {
    let con = str;
    if (con && (con.startsWith(this.config.sign) || con.endsWith(this.config.sign))) {
      con = _.trim(con, this.config.sign);
    }
    return this.config.sign + con;
  }

  sendVcode(mobile, msg) {
    return this.sendSms(mobile, msg);
  }

  /**
   * 大汉三通单一短信发送，支持对多手机号发送相同内容的短信，这里做个规范，单一短信只对一个手机号做发送
   */
  sendSms(mobile, msg) {
    if (!msg || !mobile) {
      throw new InvalidArgumentException('Please specify params: mobile and msg!');
    }

    const msgid = Dahansantong.getMsgid();

    return this.send('/json/sms/Submit', {
      phones: mobile,
      content: this.autoSignContext(msg),
      subcode: this.config.subcode,
      sign: this.config.sign,
      msgid, // 每批的msgid一致
      sendtime: null,
    }).then(res => Dahansantong.getSmsResponse(res, msgid));
  }

  sendPkg(pkg) {
    if (!_.isArray(pkg) || !pkg.length) {
      throw new InvalidArgumentException('Invalid format: pkg!');
    }
    if (pkg.length > PKG_MAX_LEN) {
      throw new InvalidArgumentException(`Every time may not be sent more than ${PKG_MAX_LEN} msg`);
    }

    const msgid = Dahansantong.getMsgid();
    const newPkg = pkg.map(ctx => ({
      phones: ctx.phone,
      content: this.autoSignContext(ctx.context),
      subcode: this.config.subcode,
      sign: this.config.sign,
      msgid,
      sendtime: null,
    }));
    return this.send('/json/sms/BatchSubmit', {
      data: newPkg,
    }).then(res => Dahansantong.getSmsResponse(res, msgid));
  }

  send(api, data) {
    const form = {
      account: this.config.account,
      password: md5(this.config.password),
    };
    Object.assign(form, data);
    return this.request({
      url: this.config.domain + api,
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: form,
      timeout: 10000,
      json: true,
    });
  }

}
