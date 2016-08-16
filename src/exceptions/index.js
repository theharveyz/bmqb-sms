import path from 'path';
import appRoot from 'app-root-path';
import { crc32 } from '../utils';

export class Exception extends Error {
  constructor(...args) {
    const params = Array.from(new Set(args));
    const [msg, statusCode] = params;
    if (typeof msg === 'number' || (params.length === 1 && msg.startsWith(path.sep) === true)) {
      throw new TypeError('Exception message not allow pure number or a file path');
    }
    // 这里无需再传递给Error message
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = Exception.generateCode(this.constructor.name, __filename);
    // 必须要指定message，来覆盖Error的message属性
    this.message = `${this.code}: ${msg}`;
    this.statusCode = statusCode || 500;
  }

  static hash(str, padstr = '0000000000') {
    const crcstr = crc32(str).toString();
    return padstr.substring(0, padstr.length - crcstr.length) + crcstr;
  }

  static generateCode(className, fileName = __dirname) {
    const namespace = fileName.replace(appRoot.path, '').split(path.sep).join('/');
    const group = crc32(namespace).toString().substring(0, 5);
    return parseInt(`${group}000${Exception.hash(className)}`, 10);
  }
}


export class LogicException extends Exception {
  constructor(...args) {
    super(...args);
    this.statusCode = 400;
  }
}

export class InvalidArgumentException extends LogicException {
}

export class RuntimeException extends Exception {
}
