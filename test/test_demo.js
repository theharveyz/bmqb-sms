import BmqbSms from '../src';
import crypto from 'crypto';


const options = {
  'smser': 'boshitong',
  'config': {
    'domain': 'http://112.74.128.143:9890',
    'uid': '710520',
    'pwd': 'BT710520',
    'srcphone': '106900840520',
  },
  'debug': true
};

const sms = new BmqbSms(options);
sms.sendSms('13871451762', 'hello');
console.log(sms.sendPkg());

