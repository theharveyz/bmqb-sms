import moment from 'moment';
import SmserAbstract from './abstract';
import { md5 } from '../utils';
import SmsResponse from '../sms_response';
import { InvalidArgumentException } from '../exceptions';

export default class Yuntongxin extends SmserAbstract {

  constructor(config, request) {
    super({
      sandbox: null,
      account_sid: null,
      app_id: null,
      auth_token: null,
    });
    this.setConfig(config);
    this.request = request;
  }

  sendVcode(mobile, code) {
    if (!code || !mobile) {
      throw new InvalidArgumentException('Please specify params: mobile and msg!');
    }
    if (!this.config.vcode_template_id) {
      throw new InvalidArgumentException('Please specify the config param: vcode_template_id!');
    }
    if (!('vcode_timeout_min' in this.config) || !this.config.vcode_timeout_min) {
      this.config.vcode_timeout_min = '10';
    }
    this.config.vcode_timeout_min = this.config.vcode_timeout_min.toString();

    return this.send('/SMS/TemplateSMS', {
      to: mobile,
      templateId: this.config.vcode_template_id,
      datas: [code, this.config.vcode_timeout_min],
    });
  }

  sendVoiceVcode(mobile, code) {
    if (!code || !mobile) {
      throw new InvalidArgumentException('Please specify params: mobile and msg!');
    }

    if (!('play_times' in this.config) || !this.config.play_times) {
      this.config.play_times = 2;
    }

    return this.send('/Calls/VoiceVerify', {
      to: mobile,
      verifyCode: code,
      playTimes: this.config.play_times,
    });
  }

  send(api, payload) {
    let baseUrl = 'https://app.cloopen.com:8883';
    if (this.config.sandbox) {
      baseUrl = 'https://sandboxapp.cloopen.com:8883';
    }

    const batchId = moment().format('YYYYMMDDHHmmss');
    const sigParameter = md5(this.config.account_sid + this.config.auth_token + batchId)
      .toUpperCase();
    const authorization = (new Buffer(`${this.config.account_sid}:${batchId}`)).toString('base64');

    return this.request({
      url: `${baseUrl}/2013-12-26/Accounts/${this.config.account_sid}${api}?sig=${sigParameter}`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: authorization,
      },
      json: Object.assign(payload, {
        appId: this.config.app_id,
      }),
    }).then(body => {
      let status = 'failed';
      try {
        const bodyObj = body instanceof String ? JSON.parse(body) : body;
        if (bodyObj.status === '000000') {
          status = 'success';
        }
      } catch (e) {
        // ...
      }
      return new SmsResponse({
        ssid: batchId,
        status,
        body,
      });
    });
  }
}
