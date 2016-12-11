import test from 'ava';
import { useStrict } from 'mobx';
import { Field } from '../../src';

const makeField = (config) => (
  new Field({ name: 'fixture', key: 'fixture', ...config })
);

test.before(() => {
  useStrict(true);
});

test('constructor - throws when no key is given', t => {
  const error = t.throws(() => new Field({ name: 'jawn' }));
  t.is(error.message, 'Field must have a key.');
});

test('constructor - throws when no name is given', t => {
  const error = t.throws(() => new Field({ key: 'jawn' }));
  t.is(error.message, 'Field must have a name.');
});

test('key', t => {
  const field = makeField();
  t.is(field.key, 'fixture');
});

test('name', t => {
  const field = makeField();
  t.is(field.name, 'fixture');
});

test('initial', t => {
  const normal = makeField();
  t.is(normal.initial, '');
  t.is(normal.value, '');

  const override = makeField({ initial: 'pasta' });
  t.is(override.initial, 'pasta');
  t.is(override.value, 'pasta');
});

test('type', t => {
  const field = makeField({ type: 'string' });
  t.is(field.type, 'string');
});

test('type - when invalid', t => {
  t.throws(() => makeField({ type: 'jawn' }));
});

test('cast - default', t => {
  const field = makeField();
  t.is(field.cast('foo'), 'foo');
});

test('cast - custom', t => {
  const flanders = (value) => `${value}-diddly`;
  const field = makeField({ type: flanders });
  t.is(field.cast('foo'), 'foo-diddly');
});

test('isEmpty', t => {
  const field = makeField();

  field.set('');
  t.true(field.isEmpty);

  field.set('meatloaf');
  t.false(field.isEmpty);
});

test('validations', t => {
  const validator = () => null;
  const field = makeField({ validate: [validator] });
  t.is(field.validations[0], validator);
});

test('validate - valid', t => {
  const validator = () => null;
  const field = makeField({ validate: [validator] });
  t.true(field.validate());
  t.true(field.isValid);
  t.is(field.error, null);
});

test('validate - invalid', t => {
  const invalidator = () => 'this is an error';
  const field = makeField({ validate: [invalidator] });
  t.false(field.validate());
  t.false(field.isValid);
  t.is(field.error, 'this is an error');
});

test('handleChange - event', t => {
  const field = makeField();
  field.handleChange({ target: { value: 'meatloaf' } });
  t.is(field.value, 'meatloaf');
});

test('reset', t => {
  const field = makeField();

  field.set('foo');
  t.is(field.value, 'foo');

  field.reset();
  t.is(field.value, '');
});

test('reset - with initial value', t => {
  const field = makeField({ initial: 'foo' });

  field.set('bar');
  t.is(field.value, 'bar');

  field.reset();
  t.is(field.value, 'foo');
});

test('set', t => {
  const field = makeField();
  field.set('meatloaf');
  t.is(field.value, 'meatloaf');
});

test('set - triggers validation', t => {
  const truthy = f => f.value ? null : 'invalid';
  const field = makeField({ validate: [truthy] });

  field.set(false);
  t.false(field.isValid);

  field.set(true);
  t.true(field.isValid);
});

test('setError', t => {
  const error = 'Whoa there';
  const field = makeField();

  t.is(field.error, null);
  t.true(field.isValid);

  field.setError(error);
  t.is(field.error, error);
  t.false(field.isValid);

  field.setError(null);
  t.is(field.error, null);
  t.true(field.isValid);
});

test('handleChange', t => {
  const caster = (value) => `${value}-diddly`;
  const field = makeField({ type: caster });

  field.handleChange('foo');
  t.is(field.value, 'foo-diddly');
});

test('handleFocus', t => {
  const field = makeField();
  t.false(field.isFocused);

  field.handleFocus();
  t.true(field.isFocused);

  field.handleBlur();
  t.false(field.isFocused);
});
