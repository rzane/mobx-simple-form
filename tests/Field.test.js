import test from 'ava';
import { Field } from '../src';

test('constructor - throws when no name is given', t => {
  const error = t.throws(() => new Field({}));
  t.is(error.message, 'A field must have a name.');
});

test('name', t => {
  const field = new Field({ name: 'username' });
  t.is(field.name, 'username');
});

test('initial', t => {
  const normal = new Field({ name: 'username' });
  t.is(normal.initial, '');
  t.is(normal.value, '');

  const override = new Field({ name: 'username', initial: 'pasta' });
  t.is(override.initial, 'pasta');
  t.is(override.value, 'pasta');
});

test('isBoolean', t => {
  const notBool = new Field({ name: 'confirm' });
  t.false(notBool.isBoolean);

  const bool = new Field({ name: 'confirm', type: 'boolean' });
  t.true(bool.isBoolean);
});

test('set', t => {
  const field = new Field({ name: 'username' });
  field.set('meatloaf');
  t.is(field.value, 'meatloaf');
});

test('handleChange', t => {
  const field = new Field({ name: 'username' });
  field.handleChange('meatloaf');
  t.is(field.value, 'meatloaf');
});

test('handleChange - event', t => {
  const field = new Field({ name: 'username' });
  field.handleChange({ target: { value: 'meatloaf' } });
  t.is(field.value, 'meatloaf');
});

test('handleChange - event with boolean', t => {
  const field = new Field({ name: 'confirm', type: 'boolean' });

  field.handleChange({ target: { checked: false } });
  t.false(field.value);

  field.handleChange({ target: { checked: true } });
  t.true(field.value);
});

test('reset', t => {
  const field = new Field({ name: 'username' });

  field.set('foo');
  t.is(field.value, 'foo');

  field.reset();
  t.is(field.value, '');
});

test('reset - with initial value', t => {
  const field = new Field({
    name: 'username',
    initial: 'foo'
  });

  field.set('bar');
  t.is(field.value, 'bar');

  field.reset();
  t.is(field.value, 'foo');
});
