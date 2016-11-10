import BmqbSms from '../src';

/**
 * 目前只有 云通信 是通过模板进行发送的
 */

const demoOptions = {
  'smser': 'yuntongxin',
  'debug': true,
  'config': {
    sandbox: true,
    account_sid: '00000000000000000000000000000000',
    auth_token: '00000000000000000000000000000000',
    app_id: '00000000000000000000000000000000',
    play_times: 2,
    vcode_template_id: 11111,
  },
};

const sms = new BmqbSms(demoOptions);

// 发送语音验证码
// 这里直接传递code，而非整条短信内容
sms.sendVcode('11111111111', '123456').then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
