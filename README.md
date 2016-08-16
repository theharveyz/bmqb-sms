# bmqb-sms
贝米钱包短信发送库

## 使用方式：
####1. 必要配置：
```JavaScript
{
  'smser': 'yuntongxin',
  'config': {
  	...
  }
}
```
* `smser`: 指定发送渠道
* `config`: 发送渠道必要配置（接口鉴权等必要配置信息）
* `debug`: [*可选*], 为`true`时，将在命令行输出接口请求详细信息

####2. 调用方式：
```JavaScript
//以yuntongxin为例
const options = {
  'smser': 'yuntongxin',
  'config': {
    'sandbox': true,
    'account_sid': '00000000000000000000000000000000',
    'auth_token': '00000000000000000000000000000000',
    'app_id': '00000000000000000000000000000000',
    'vcode_template_id': 1,
    'vcode_timeout_min': 10,
  },
};

const sms = new BmqbSms(options);
sms.sendVcode('13871451762', '你的验证码是...').then(res => {
  console.log(res);
});
```

####3. API：
* sendVcode(mobile, msg): 发送短信验证码
* sendSms(mobile, msg): 单条短信发送
* sendVoiceVcode(mobile, code): 发送语音验证码，**目前仅支持云通信**
* sendPkg(pkg): 群发，格式为:
```JSON
[
  {
	"phone": "手机号1",
	"context": "%E6%B5%8B%E8%AF%950"
  },
  {
	"phone": "手机号2",
	"context": "%E6%B5%8B%E8%AF%951"
  },
  {
	"phone": "手机号3",
	"context": "%E6%B5%8B%E8%AF%952"
  }
]
```

> NOTICE: 不支持某种发送方式的渠道，当调用该种方式API时，将会抛出异常！


####4. 返回结果：
约定返回结果为一个`SmsResponse`对象，该对象有以下属性：
* status: 请求状态(success|failed|pending)
* ssid: 发送批次号
* body: 接口原始响应结果
