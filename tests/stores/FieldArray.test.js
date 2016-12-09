import test from 'ava';
import { useStrict } from 'mobx';
import { Field, FieldArray, FieldObject } from '../../src';

const makeField = (config) => new FieldArray({
  ...config,
  buildFields (name) {
    return new FieldObject({
      name,
      fields: [
        new Field({
          name: 'fixture',
          initial: 'meatloaf'
        })
      ]
    });
  }
});

const fixtureData = [{
  fixture: 'Rick'
}, {
  fixture: 'Flair'
}];

test.before(() => {
  useStrict(true);
});

test('initial', t => {
  const field = makeField({
    initialCount: 2
  });

  t.is(field.fields.length, 2);
});

test('get', t => {
  const field = makeField();
  field.add();

  t.truthy(field.get(0));
  t.falsy(field.get(1));
});

test('values', t => {
  const field = makeField();
  field.set(fixtureData);
  t.deepEqual(field.values(), fixtureData);
});

test('errors', t => {
  const field = makeField();
  field.set(fixtureData);
  t.deepEqual(field.values(), fixtureData);
});

test('add', t => {
  const field = makeField();
  t.is(field.fields.length, 0);

  field.add();
  t.is(field.get(0).name, '0');

  field.add();
  t.is(field.get(1).name, '1');

  t.is(field.fields.length, 2);

  field.get(1).handleRemove();
  t.is(field.fields.length, 1);
});

test('remove', t => {
  const field = makeField();

  field.add();
  t.is(field.fields.length, 1);

  field.remove(field.get(0));
  t.is(field.fields.length, 0);
});

test('set', t => {
  const field = makeField();
  field.set(fixtureData);

  t.is(field.fields.length, 2);
  t.is(field.get(0).get('fixture').value, 'Rick');
  t.is(field.get(1).get('fixture').value, 'Flair');
});

test('setErrors', t => {
  const field = makeField();
  field.add();
  field.add();

  field.setErrors(fixtureData);

  t.false(field.isValid);
  t.is(field.getIn([0, 'fixture']).error, 'Rick');
  t.is(field.getIn([1, 'fixture']).error, 'Flair');
});

test('setErrors - range error', t => {
  const field = makeField();

  t.throws(() => {
    field.setErrors([{ fixture: 'boom' }]);
  });
});

test('reset', t => {
  const field = makeField();
  field.add();
  field.reset();
  t.is(field.fields.length, 0);
});

test('reset - initial', t => {
  const field = makeField({
    initialCount: 2
  });

  field.set([{ fixture: 'foo' }]);
  field.reset();

  t.is(field.getIn([0, 'fixture']).value, 'meatloaf');
  t.is(field.getIn([1, 'fixture']).value, 'meatloaf');
});
