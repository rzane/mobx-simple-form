import test from 'ava';
import hasMany from '../../src/fields/hasMany';
import FieldArray from '../../src/stores/FieldArray';

test('creates a field array', t => {
  t.true(hasMany('name', []) instanceof FieldArray);
});

test('takes a name', t => {
  const field = hasMany('name', []);
  t.is(field.name, 'name');
});

test('takes an array of fields', t => {
  const fields = [];
  const field = hasMany('name', fields);
  t.is(field.config, fields);
});

test('accepts optional config', t => {
  const initial = [{}];
  const field = hasMany('name', [], { initial });
  t.is(field.initial, initial);
});

test('throws when no name is given', t => {
  t.throws(() => hasMany());
});

test('throws when no fields are given', t => {
  t.throws(() => hasMany('foo'));
});
