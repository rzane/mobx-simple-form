import test from 'ava';
import { useStrict } from 'mobx';
import { Field, FieldArray, FieldObject } from '../../src';

const fixtureData = {
  simple: 'jawn',
  nested: {
    foo: 'one',
    bar: 'two'
  },
  repeat: [{
    meat: 'one',
    loaf: 'two'
  }, {
    meat: 'three',
    loaf: 'four'
  }]
};

const makeField = ({ simple, nested, repeat } = {}) => new FieldObject({
  fields: [
    new Field({ name: 'simple', ...simple }),
    new FieldObject({
      name: 'nested',
      fields: [
        new Field({ name: 'foo', ...nested }),
        new Field({ name: 'bar' })
      ]
    }),
    new FieldArray({
      name: 'repeat',
      buildFields (name) {
        return new FieldObject({
          name,
          fields: [
            new Field({ name: 'meat', ...repeat }),
            new Field({ name: 'loaf' })
          ]
        });
      }
    })
  ]
});

const makeValidationField = () => {
  const truthy = f => f.value ? null : 'invalid';
  const config = { validate: [truthy] };

  const field = makeField({
    simple: config,
    nested: config,
    repeat: config
  });

  field.set(fixtureData);
  return field;
};

test.before(() => {
  useStrict(true);
});

test('get', t => {
  const field = makeField();

  t.falsy(field.get('unknown'));

  ['simple', 'nested', 'repeat'].forEach(name => {
    t.truthy(field.get(name));
  });
});

test('getIn', t => {
  const field = makeField();
  field.get('repeat').add();

  t.truthy(field.getIn(['simple']));
  t.falsy(field.getIn(['unknown']));

  t.truthy(field.getIn(['nested']));
  t.truthy(field.getIn(['nested', 'foo']));
  t.falsy(field.getIn(['nested', 'unknown']));

  t.truthy(field.getIn(['repeat', 0, 'meat']));
  t.falsy(field.getIn(['repeat', 1, 'meat']));
  t.falsy(field.getIn(['repeat', 0, 'unknown']));
});

test('values', t => {
  const field = makeField();
  field.set(fixtureData);
  t.deepEqual(field.values(), fixtureData);
});

test('errors', t => {
  const field = makeField();
  field.get('repeat').add();
  field.get('repeat').add();

  field.setErrors(fixtureData);
  t.deepEqual(field.errors(), fixtureData);
});

test('set', t => {
  const field = makeValidationField();
  field.set(fixtureData);

  t.is(field.get('simple').value, 'jawn');

  t.is(field.getIn(['nested', 'foo']).value, 'one');
  t.is(field.getIn(['nested', 'bar']).value, 'two');

  t.is(field.getIn(['repeat', 0, 'meat']).value, 'one');
  t.is(field.getIn(['repeat', 0, 'loaf']).value, 'two');
  t.is(field.getIn(['repeat', 1, 'meat']).value, 'three');
  t.is(field.getIn(['repeat', 1, 'loaf']).value, 'four');
});

test('setErrors', t => {
  const field = makeField();
  field.get('repeat').add();
  field.get('repeat').add();

  field.setErrors(fixtureData);

  t.is(field.get('simple').error, 'jawn');

  t.is(field.getIn(['nested', 'foo']).error, 'one');
  t.is(field.getIn(['nested', 'bar']).error, 'two');

  t.is(field.getIn(['repeat', 0, 'meat']).error, 'one');
  t.is(field.getIn(['repeat', 0, 'loaf']).error, 'two');
  t.is(field.getIn(['repeat', 1, 'meat']).error, 'three');
  t.is(field.getIn(['repeat', 1, 'loaf']).error, 'four');
});

test('reset', t => {
  const field = makeField({
    simple: { initial: 'foo' },
    nested: { initial: 'bar' },
    repeat: { initial: 'buzz' }
  });

  field.set(fixtureData);
  field.reset();

  t.is(field.get('simple').value, 'foo');

  t.is(field.getIn(['nested', 'foo']).value, 'bar');
  t.is(field.getIn(['nested', 'bar']).value, '');

  t.is(field.get('repeat').fields.length, 0);
});

test('reset - clears errors', t => {
  const field = makeValidationField();

  field.set({ nested: { foo: false } });
  t.truthy(field.getIn(['nested', 'foo']).error);

  field.reset();
  t.falsy(field.getIn(['nested', 'foo']).error);
});

test('validate', t => {
  const field = makeValidationField();
  t.true(field.isValid);

  field.set({ simple: false });
  t.false(field.isValid);

  field.set({ simple: true });
  t.true(field.isValid);
});

test('validate - object', t => {
  const field = makeValidationField();
  t.true(field.isValid);

  field.set({ nested: { foo: false } });
  t.false(field.isValid);

  field.set({ nested: { foo: true } });
  t.true(field.isValid);
});

test('validate - array', t => {
  const field = makeValidationField();
  t.true(field.isValid);

  field.set({ repeat: [{ meat: false }] });
  t.false(field.isValid);

  field.set({ repeat: [{ meat: true }] });
  t.true(field.isValid);
});

test('handleRemove', t => {
  const field = makeField();
  t.throws(() => field.handleRemove());
});
