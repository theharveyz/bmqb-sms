export default class SmserAbstract {
  constructor(...args) {}

  /**
   * 发送单条
   * @returns {Promise}
   */
  sendSms(mobile, msg) { return new Promise(); }

  /**
   * 群发
   * @returns {Promise}
   */
  sendPkg(pkg) { return new Promise(); }
}
