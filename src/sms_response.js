export default class SmsResponse {
  /**
   * @param ssid 批次号
   * @param status 状态 (success|failed|pending)
   * @param response 响应内容
   */
  constructor({ssid, status, body}) {
    this.ssid = ssid;
    this.status = status;
    //保持返回数据格式一致性
    try {
      body = JSON.stringify(body);
    }catch(e){}
    this.body = body;
  }
}
