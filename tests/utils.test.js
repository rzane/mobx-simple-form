import test from 'ava';
import { isEmpty } from '../src/utils';

test('isEmpty', t => {
  [undefined, null, '', [], {}].forEach(value => {
    t.true(isEmpty(value));
  });

  [true, false, 0, 1, 'meatloaf', [1], { a: 'b' }].forEach(value => {
    t.false(isEmpty(value));
  });
});
