import crypto from 'crypto';

export const encodeBase64Url = (content) => {
  const javaURLEncode = (str) => {
    return encodeURI(str)
      .replace(/%20/g, '+')
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/~/g, '%7E');
  }

  return new Buffer(javaURLEncode(content)).toString('base64');
};

export const md5 = (content) => {
  return crypto.createHash('md5').update(content).digest('hex')
};
