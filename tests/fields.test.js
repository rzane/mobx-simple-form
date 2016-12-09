import test from 'ava';
import simpleForm, {
  field,
  hasOne,
  hasMany,
  Form,
  Field,
  FieldObject,
  FieldArray
} from '../src';

test('field - can take just a name', t => {
  t.deepEqual(field('jawn'), { name: 'jawn' });
});

test('field - accepts optional config', t => {
  t.deepEqual(
    field('jawn', { foo: 'bar' }),
    { name: 'jawn', foo: 'bar' }
  );
});

test('field - throws for invalid name', t => {
  t.throws(() => field());
  t.throws(() => field(1));
  t.throws(() => field({}));
});

test('hasOne - creates a FieldObject', t => {
  t.true(hasOne('name', []) instanceof FieldObject);
});

test('hasOne - takes a name', t => {
  t.is(hasOne('name', []).name, 'name');
});

test('hasOne - builds fields when given string', t => {
  t.true(hasOne('name', ['foo']).get('foo') instanceof Field);
});

test('hasOne - builds fields when given field', t => {
  t.true(hasOne('name', [field('foo')]).get('foo') instanceof Field);
});

test('hasOne - throws for invalid name', t => {
  t.throws(() => hasOne());
  t.throws(() => hasOne(1));
  t.throws(() => hasOne({}));
});

test('hasOne - throws when no fields are given', t => {
  t.throws(() => hasOne('foo'));
});

test('hasMany - creates a field array', t => {
  t.true(hasMany('name', []) instanceof FieldArray);
});

test('hasMany - takes a name', t => {
  t.is(hasMany('name', []).name, 'name');
});

test('hasMany - creates a buildFields func to create a FieldObject', t => {
  t.true(hasMany('name', []).buildFields('foo') instanceof FieldObject);
});

test('hasMany - buildFields takes a name', t => {
  t.is(hasMany('name', []).buildFields('foo').name, 'foo');
});

test('hasMany - buildFields always returns a fresh FieldObject', t => {
  const many = hasMany('name', []);
  t.not(many.buildFields('foo'), many.buildFields('foo'));
});

test('hasMany - accepts optional config for initialCount', t => {
  t.is(hasMany('name', [], { initialCount: 1 }).initialCount, 1);
});

test('hasMany - throws for invalid name', t => {
  t.throws(() => hasMany());
  t.throws(() => hasMany(1));
  t.throws(() => hasMany({}));
});

test('hasMany - throws when no fields are given', t => {
  t.throws(() => hasMany('foo'));
});

test('simpleForm - creates a FieldObject', t => {
  t.true(simpleForm([]) instanceof Form);
});

test('simpleForm - builds a deeply nested form', t => {
  const testForm = simpleForm([
    'name',
    field('email'),
    hasOne('address', [
      field('street'),
      hasOne('city', [
        'name',
        field('zipCode'),
        hasMany('residents', [field('name')])
      ])
    ]),
    hasMany('friends', [
      field('name'),
      hasOne('skill', [field('name')]),
      hasMany('pets', [field('name')])
    ])
  ]);

  testForm.get('friends').add();
  testForm.get('friends').add();
  testForm.getIn(['address', 'city', 'residents']).add();
  testForm.getIn(['address', 'city', 'residents']).add();
  testForm.getIn(['friends', 0, 'pets']).add();
  testForm.getIn(['friends', 0, 'pets']).add();

  const coordinates = [
    ['name'],
    ['email'],
    ['address', 'street'],
    ['address', 'city', 'name'],
    ['address', 'city', 'zipCode'],
    ['address', 'city', 'residents', 0, 'name'],
    ['address', 'city', 'residents', 1, 'name'],
    ['friends', 0, 'name'],
    ['friends', 0, 'skill', 'name'],
    ['friends', 0, 'pets', 0, 'name'],
    ['friends', 0, 'pets', 1, 'name']
  ];

  coordinates.forEach((coordinate) => {
    t.true(testForm.getIn(coordinate) instanceof Field);
    t.is(testForm.getIn(coordinate).name, coordinate[coordinate.length - 1]);
  });
});
