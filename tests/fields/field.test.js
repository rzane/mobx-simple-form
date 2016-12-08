import test from 'ava';
import field from '../../src/fields/field';

test('accepts just a name', t => {
  t.deepEqual(field('name'), { name: 'name' });
});

test('accepts optional config', t => {
  t.deepEqual(field('name', { a: 'b' }), { name: 'name', a: 'b' });
});

test('throws when no name is given', t => {
  t.throws(() => field());
});
