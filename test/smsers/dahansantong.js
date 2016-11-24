import test from 'ava';
import { Dahansantong } from '../../src/smsers';
import SmsResponse from '../../src/sms_response';
import sinon from 'sinon';

test('smser dahansantong', async t => {
  const rp = () => {
    return Promise.resolve(null);
  };
  const requestSpy = sinon.spy(rp);
  const demoConfig = {
    domain: 'http://127.0.0.1',
    account: 'xxxxx',
    password: 'xxxxx',
    subcode: null,
    sign: '【测试】',
  };
  const smser = new Dahansantong(demoConfig, requestSpy);
  const mobile = '11111111111';
  const msg = '【测试】test';
  t.is(smser.config.sign, demoConfig.sign);
  t.is(smser.autoSignContext(msg), 'test'); // 不需要加【测试】

  const res = await smser.sendSms(mobile, msg);
  t.true(res instanceof SmsResponse);
  // ssid为生成的uuid
  t.true(32 === res.ssid.length);

  const batchRes = await smser.sendPkg([{phone: mobile, context: msg}]);
  t.true(batchRes instanceof SmsResponse);
  // ssid为生成的uuid
  t.true(32 === batchRes.ssid.length);

  const vcodeRes = await smser.sendVcode(mobile, msg);
  t.true(vcodeRes instanceof SmsResponse);
  // ssid为生成的uuid
  t.true(32 === vcodeRes.ssid.length);

  // 被调用三次
  t.true(3 === requestSpy.callCount);
});

test('Dahansantong getMsgid', t => {
  t.is(Dahansantong.getMsgid().length, 32);
});
