import BmqbSms from '../src';

/**
 * 目前只有 云通信 支持【语音验证码】的发送
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
sms.sendVoiceVcode('11111111111', '123456').then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
