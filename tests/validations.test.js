import test from 'ava';
import { createValidator, presence } from '../src';

const validate = createValidator((field, { customOpt }) => {
  if (!field.value) {
    return customOpt ? 'customOpt' : 'crap';
  }
});

test('createValidator', t => {
  t.falsy(validate()({ value: true }));

  t.is(validate()({ value: false }), 'crap');
  t.is(validate({ message: 'customMsg' })({ value: false }), 'customMsg');
  t.is(validate({ customOpt: true })({ value: false }), 'customOpt');
});

test('presence', t => {
  t.falsy(presence()({ value: true }));

  t.is(presence()({ value: null }), "can't be blank");
  t.is(presence({ message: 'meatloaf' })({ value: null }), 'meatloaf');
});
