import test from 'ava';
import { useStrict } from 'mobx';
import { Field, FieldObject, FieldArray } from '../src';

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
  fields: [{
    name: 'simple',
    ...simple
  }, {
    name: 'nested',
    type: 'object',
    fields: [{
      name: 'foo',
      ...nested
    }, {
      name: 'bar'
    }]
  }, {
    name: 'repeat',
    type: 'array',
    fields: [{
      name: 'meat',
      ...repeat
    }, {
      name: 'loaf'
    }]
  }]
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

test('fields', t => {
  const field = makeField();
  t.true(field.get('simple') instanceof Field);
  t.true(field.get('nested') instanceof FieldObject);
  t.true(field.get('repeat') instanceof FieldArray);
});

test('fields - invalid', t => {
  t.throws(() => {
    /* eslint-disable no-new */
    new FieldObject({
      fields: [{
        name: 'thing',
        fields: [{
          name: 'something'
        }]
      }]
    });
    /* eslint-enable no-new */
  });
});

test('values', t => {
  const field = makeField();
  field.set(fixtureData);
  t.deepEqual(field.values, fixtureData);
});

test('errors', t => {
  const field = makeField();
  field.get('repeat').add();
  field.get('repeat').add();

  field.setErrors(fixtureData);
  t.deepEqual(field.errors, fixtureData);
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

test('set', t => {
  const field = makeField();

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

  t.is(field.getIn(['repeat', 0, 'meat']).value, 'buzz');
  t.is(field.getIn(['repeat', 0, 'loaf']).value, '');
  t.is(field.getIn(['repeat', 1, 'meat']).value, 'buzz');
  t.is(field.getIn(['repeat', 1, 'loaf']).value, '');
});

test('validate', t => {
  const field = makeValidationField();
  t.true(field.validate());

  field.set({ simple: false });
  t.false(field.validate());

  field.set({ simple: true });
  t.true(field.validate());
});

test('validate - object', t => {
  const field = makeValidationField();
  t.true(field.validate());

  field.set({ nested: { foo: false } });
  t.false(field.validate());

  field.set({ nested: { foo: true } });
  t.true(field.validate());
});

test('validate - array', t => {
  const field = makeValidationField();
  t.true(field.validate());

  field.set({ repeat: [{ meat: false }] });
  t.false(field.validate());

  field.set({ repeat: [{ meat: true }] });
  t.true(field.validate());
});

test('handleRemove', t => {
  const field = makeField();
  t.throws(() => field.handleRemove());
});
