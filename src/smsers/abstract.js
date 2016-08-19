import _ from 'lodash';
import { RuntimeException, InvalidArgumentException } from '../exceptions';

export default class SmserAbstract {
  constructor(initConfig) {
    this.config = initConfig;
  }

  /**
   * 发送语音验证码
   * @returns {Promise}
   */
  sendVoiceVcode() {
    return new Promise(() => {
      throw new RuntimeException(
        `Class ${this.constructor.name} does not support sendVoiceVcode!`
        );
    });
  }

  /**
   * 发送验证码
   * @returns {Promise}
   */
  sendVcode() {
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} does not support sendVcode!`);
    });
  }

  /**
   * 发送单条
   * @returns {Promise}
   */
  sendSms() {
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} does not support sendSms!`);
    });
  }

  /**
   * 群发
   * @returns {Promise}
   */
  sendPkg() {
    return new Promise(() => {
      throw new RuntimeException(`Class ${this.constructor.name} does not support sendPkg!`);
    });
  }

  /**
   * 设置配置
   */
  setConfig(config) {
    const initConfig = _.clone(this.config);
    Object.assign(this.config, config);
    _.forEach(initConfig, (v, k) => {
      // 是否定义
      if (typeof this.config[k] === 'undefined') {
        throw new InvalidArgumentException(`Please specify the config param: ${k}`);
      }
    });
  }
}
