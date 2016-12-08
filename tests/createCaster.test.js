import test from 'ava';
import createCaster from '../src/createCaster';

test('createCaster - noop', t => {
  t.is(createCaster()('meatloaf'), 'meatloaf');
});

test('createCaster - input event', t => {
  t.is(createCaster()({ target: { value: 'meatloaf' } }), 'meatloaf');
});

test('createCaster - checkbox event', t => {
  t.is(createCaster()({ target: { type: 'checkbox', checked: true } }), true);
});

test('createCaster - events are casted', t => {
  t.is(createCaster('number')({ target: { value: '1' } }), 1);
});

test('createCaster - string', t => {
  t.is(createCaster('string')(1), '1');
});

test('createCaster - number', t => {
  t.is(createCaster('number')('1'), 1);
});

test('createCaster - boolean', t => {
  t.is(createCaster('boolean')(1), true);
  t.is(createCaster('boolean')(0), false);
});

test('createCaster - function', t => {
  const cast = (value) => `${value}-diddly`;
  t.is(createCaster(cast)('pasta'), 'pasta-diddly');
});

test('createCaster - function with multiple arguments', t => {
  const cast = (a, b) => `${a}/${b}`;
  t.is(createCaster(cast)('a', 'b'), 'a/b');
});
