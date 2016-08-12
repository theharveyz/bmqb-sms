import * as smsers from './smsers';
import request from './http_client';
import _ from 'lodash';

export default class BmqbSms {
  constructor({
    smser, 
    config = null, 
    debug = false
  }) {
    if (!config || !smser) {
      throw new Error('参数错误');
    }

    if (!smser in smsers) {
      throw new Error('smser not found!');
    }
    smser = _.upperFirst(smser.toLowerCase());
    return new smsers[smser](config, request(debug));
  }
}
