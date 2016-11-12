import test from 'ava';
import { md5, crc32 } from '../src/utils';

test('utils.md5', t => {
  t.is(md5('1'), 'c4ca4238a0b923820dcc509a6f75849b');
});

test('utils.crc32', t => {
  t.is(crc32('1'), 2212294583);
});
