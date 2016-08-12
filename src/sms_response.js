export default class SmsResponse {
  constructor({sid, status, content}) {
    this.sid = sid;
    this.status = status;
    this.content = content;
  }
}
