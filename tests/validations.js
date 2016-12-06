import test from 'ava';
import { createValidator, presence } from '../src';

const validate = createValidator((field, { customOpt }) => {
  if (!field.value) {
    return customOpt ? 'customOpt' : 'crap';
  }
});

test('createValidator', t => {
  t.falsy(validate()(true));

  t.is(validate()(false), 'crap');
  t.is(validate({ message: 'customMsg' })(false), 'customMsg');
  t.is(validate()(false, { customOpt: true }), 'customOpt');
});

test('presence', t => {
  t.is(presence()(null), "can't be blank");
  t.is(presence({ message: 'meatloaf' })(undefined), 'meatloaf');

  t.falsy(presence()(false));
  t.falsy(presence()(true));

  t.falsy(presence()(1));
  t.falsy(presence()(0));

  t.falsy(presence()('meatloaf'));
  t.truthy(presence()(''));

  t.falsy(presence()([1]));
  t.falsy(presence()([null]));
  t.truthy(presence()([]));

  t.falsy(presence()({ a: 'b' }));
  t.truthy(presence()({}));
});
