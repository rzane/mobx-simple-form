import test from 'ava';
import hasOne from '../../src/fields/hasOne';
import FieldObject from '../../src/stores/FieldObject';

test('creates a field array', t => {
  t.true(hasOne('name', []) instanceof FieldObject);
});

test('takes a name', t => {
  const field = hasOne('name', []);
  t.is(field.name, 'name');
});

test('builds fields - given string', t => {
  const field = hasOne('name', ['foo']);
  t.is(field.get('foo').name, 'foo');
});

test('builds fields - given object', t => {
  const field = hasOne('name', [{
    name: 'foo',
    initial: 'flergh'
  }]);

  t.is(field.get('foo').name, 'foo');
  t.is(field.get('foo').initial, 'flergh');
});

test('throws when no name is given', t => {
  t.throws(() => hasOne());
});

test('throws when no fields are given', t => {
  t.throws(() => hasOne('foo'));
});
