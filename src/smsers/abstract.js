import _ from 'lodash';
import { RuntimeException, InvalidArgumentException } from '../exceptions';

export default class SmserAbstract {
  constructor(init_config) {
    this.config = init_config;
  }

  /**
   * 发送语音验证码
   * @returns {Promise}
   */
  sendVoiceVcode(mobile, code) { 
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} A does not support sendVoiceVcode!`);
    });
  }

  /**
   * 发送验证码
   * @returns {Promise}
   */
  sendVcode(mobile, code) { 
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} A does not support sendVcode!`);
    });
  }

  /**
   * 发送单条
   * @returns {Promise}
   */
  sendSms(mobile, msg) { 
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} A does not support sendSms!`);
    });  
  }

  /**
   * 群发
   * @returns {Promise}
   */
  sendPkg(pkg) {
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} A does not support sendPkg!`);
    });
  }

  /**
   * 设置配置
   */
  setConfig(_config) {
    const init_config = _.clone(this.config);
    Object.assign(this.config, _config);
    _.forEach(init_config, (v, k) => {
      if(!this.config[k]){
        throw new InvalidArgumentException(`Please specify the config param: ${k}`);
      }
    });
  }
}
