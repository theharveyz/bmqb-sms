import BmqbSms from '../src';

const demoOptions = {
  'smser': 'dahansantong',
  'debug': true,
  'config': {
      domain: 'localhost',
      account: 'xxxxx',
      password: 'xxxxx',
      subcode: 'xxxx',
  },
};

const sms = new BmqbSms(demoOptions);

// 发送验证码
sms.sendVcode('11111111111', '你的验证码是123456').then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});

// 一般短信
sms.sendSms('11111111111', 'test').then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});

// 群发，最好不要超过500条，dahansantong有限制
sms.sendPkg([{'phone': '11111111111', 'context': 'test'}])
.then((res) => console.log(res))
.catch(err => {
  console.log(err);
});
