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
  t.deepEqual(field('jawn'), {
    name: 'jawn',
    field: Field
  });
});

test('field - accepts optional config', t => {
  t.deepEqual(field('jawn', { foo: 'bar' }), {
    name: 'jawn',
    foo: 'bar',
    field: Field
  });
});

test('field - throws for invalid name', t => {
  t.throws(() => field());
  t.throws(() => field(1));
  t.throws(() => field({}));
});

test('hasOne - expands config', t => {
  t.deepEqual(hasOne('jawn', ['jint']), {
    name: 'jawn',
    fields: ['jint'],
    field: FieldObject
  });
});

test('hasOne - throws for invalid name', t => {
  t.throws(() => hasOne());
  t.throws(() => hasOne(1));
  t.throws(() => hasOne({}));
});

test('hasOne - throws when no fields are given', t => {
  t.throws(() => hasOne('foo'));
});

test('hasMany - expands config', t => {
  const { buildFields, ...config } = hasMany('jawns', ['jint'], {
    initialCount: 1
  });

  t.true(typeof buildFields === 'function');
  t.deepEqual(config, {
    name: 'jawns',
    initialCount: 1,
    field: FieldArray
  });
});

test('hasMany - creates a buildFields func to create a FieldObject', t => {
  t.true(hasMany('name', []).buildFields('foo', 1) instanceof FieldObject);
});

test('hasMany - buildFields generates names', t => {
  const field = hasMany('name', []);
  const subfield = field.buildFields('foo', 1);

  t.is(subfield.name, '1');
  t.is(subfield.inputName, 'foo[1]');
});

test('hasMany - buildFields always returns a fresh FieldObject', t => {
  const many = hasMany('name', []);
  t.not(many.buildFields('foo', 1), many.buildFields('foo', 1));
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

const testNesting = (type) => (path) => {
  test(`simpleForm - ${path.join(' > ')}`, t => {
    const form = simpleForm([
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

    form.get('friends').add();
    form.get('friends').add();
    form.getIn(['address', 'city', 'residents']).add();
    form.getIn(['address', 'city', 'residents']).add();
    form.getIn(['friends', 0, 'pets']).add();
    form.getIn(['friends', 0, 'pets']).add();

    t.true(form.getIn(path) instanceof type);
    t.is(form.getIn(path).name, path[path.length - 1]);
    t.is(form.getIn(path).inputName, path.reduce(
      (name, coord) => `${name}[${coord}]`
    ));
  });
};

[
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
].forEach(testNesting(Field));

[
  ['friends'],
  ['address', 'city', 'residents']
].forEach(testNesting(FieldArray));
