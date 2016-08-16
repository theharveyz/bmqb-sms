import appRoot from 'app-root-path';
import path from 'path';
import crypto from 'crypto';
import BmqbSms from '../';
import { InvalidArgumentException } from '../src/exceptions';


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
sms.sendVcode('13871451762', 'hello').then(res => {
  console.log(res);
});
sms.sendPkg([{'phone': '13871451762', 'context': 'ni'}])
.then((res) => console.log(res))
.catch(err => {
  console.log(err);
});
