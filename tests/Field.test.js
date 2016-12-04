import test from 'ava';
import { useStrict } from 'mobx';
import { Field } from '../src';

const makeField = (config) => {
  return new Field({ name: 'fixture', ...config });
};

test.before(() => {
  useStrict(true);
});

test('constructor - throws when no name is given', t => {
  const error = t.throws(() => new Field({}));
  t.is(error.message, 'A field must have a name.');
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
  const field = makeField({ type: 'foo' });
  t.is(field.type, 'foo');
})

test('cast - default', t => {
  const field = makeField();
  t.is(field.cast('foo'), 'foo');
});

test('cast - default with input', t => {
  const field = makeField();
  t.is(field.cast({ target: { value: 'foo' } }), 'foo');
  t.is(field.cast({ target: { value: '' } }), '');
});

test('cast - default with checkbox', t => {
  const field = makeField();
  t.true(field.cast({ target: { checked: true, type: 'checkbox' } }));
  t.false(field.cast({ target: { checked: false, type: 'checkbox' } }));
});

test('cast - string', t => {
  const field = makeField({ type: 'string' });
  t.is(field.cast(1), '1');
  t.is(field.cast('foo'), 'foo');
});

test('cast - number', t => {
  const field = makeField({ type: 'number' });
  t.is(field.cast('1'), 1);
  t.is(field.cast(1), 1);
  t.is(field.cast(0), 0);
})

test('cast - boolean', t => {
  const field = makeField({ type: 'boolean' });

  [true, '1', 1].forEach(value => t.true(field.cast(value)));
  [false, undefined, null, 0, ''].forEach(value => t.false(field.cast(value)));
});

test('cast - custom', t => {
  const caster = (value) => `${value}-diddly`;
  const field = makeField({ type: caster });
  t.is(field.cast('foo'), 'foo-diddly');
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
