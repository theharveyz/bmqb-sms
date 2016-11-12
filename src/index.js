import _ from 'lodash';
import * as smsers from './smsers';
import request from './http_client';
import { InvalidArgumentException } from './exceptions';

const SIGN = '【贝米钱包】';

export default class BmqbSms {
  constructor({
    smser,
    config = null,
    debug = false,
    sign = SIGN,
  }) {
    if (!config || !smser) {
      throw new InvalidArgumentException('Invalid format of config!');
    }

    const smserClass = _.upperFirst(smser.toLowerCase());
    if (!(smserClass in smsers)) {
      throw new InvalidArgumentException('The smser is not found!');
    }
    if (!sign) {
      throw new InvalidArgumentException('The sign is empty!');
    }
    Object.assign(config, {
      sign,
    });
    return new smsers[smserClass](config, request(debug));
  }
}
