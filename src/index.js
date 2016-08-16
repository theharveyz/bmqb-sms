import _ from 'lodash';
import * as smsers from './smsers';
import request from './http_client';
import { InvalidArgumentException } from './exceptions';

export default class BmqbSms {
  constructor({
    smser,
    config = null,
    debug = false,
  }) {
    if (!config || !smser) {
      throw new InvalidArgumentException('Invalid format of config!');
    }

    if (!smser in smsers) {
      throw new InvalidArgumentException('The smser not found!');
    }
    const smser_class = _.upperFirst(smser.toLowerCase());
    return new smsers[smser_class](config, request(debug));
  }
}
