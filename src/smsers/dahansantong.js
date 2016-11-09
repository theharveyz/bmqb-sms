import _ from 'lodash';
import moment from 'moment';
import SmserAbstract from './abstract';
import { md5 } from '../utils';
import uuid from 'node-uuid';
import SmsResponse from '../sms_response';
import { InvalidArgumentException } from '../exceptions';

const SIGN_MSG = '【贝米钱包】';
// 批量发送最大支持条数
const PKG_MAX_LEN = 500;

export default class Dahansantong extends SmserAbstract {
  static getMsgid() {
    return uuid.v4();
  }

  constructor(config, request) {
    super({
      domain: null,
      account: null,
      password: null,
      subcode: null,
      sign: SIGN_MSG, // 短信签名
    });
    this.setConfig(config);
    this.request = request;
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
      content: msg,
      subcode: this.config.subcode,
      sign: this.config.sign,
      msgid, // 每批的msgid一致
    }).then(res => {
      let status = 'failed';
      if (res && res.msgid) {
        status = res.status === '0' || res.status === 0 ? 'success' : status;
      }
      return new SmsResponse({
        ssid: msgid,
        status,
        body: res,
      });
    });
  }

  sendPkg(pkg) {
    if (!_.isArray(pkg) || !pkg.length) {
      throw new InvalidArgumentException('Invalid format: pkg!');
    }
    if (pkg.length > PKG_MAX_LEN) {
      throw new InvalidArgumentException('Every time may not be sent more than 1000 msg');
    }
    const newPkg = pkg.map(ctx => {
      return {
        phones: ctx.phone,
        content: ctx.context,
        subcode: this.config.subcode,
        sign: this.config.sign,
        msgid: Dahansantong.getMsgid(),
      };
    });
    return this.send('/cmppweb/sendsmspkg', {
      data: newPkg,
    }).then(res => {
      let status = 'failed';
      if (res && res.msgid) {
        status = res.status === '0' || res.status === 0 ? 'success' : status;
      }
      return new SmsResponse({
        ssid: msgid,
        status,
        body: res,
      });
    });
  }

  send(api, data) {
    const form = {
      account: this.config.account,
      password: md5(this.config.password),
    };
    Object.assign(form, data);

    return this.request({
      url: this.config.domain + api,
      method: 'POST',
      form,
      timeout: 10000,
      useQuerystring: true,
    });
  }

}
