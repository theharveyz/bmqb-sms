export default class SmsResponse {
  /**
   * @param ssid 批次号[必填]
   * @param status 状态 (success|failed|error)[必填]
   * @param body 响应内容
   */
  constructor({
    ssid,
    status,
    body,
  }) {
    this.ssid = ssid;
    this.status = status;
    // 保持返回数据格式一致性
    this.body = body;
    try {
      this.body = JSON.stringify(body);
    } catch (e) {
      // ...
    }
  }
}
