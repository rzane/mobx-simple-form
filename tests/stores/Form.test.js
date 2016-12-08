import test from 'ava';
import { useStrict } from 'mobx';
import Form, {
  field,
  hasOne,
  hasMany,
  Field // ,
  // FieldObject,
  // FieldArray,
} from '../../src';

test.before(() => {
  useStrict(true);
});

test('create', t => {
  const form = Form.create(['simple']);
  t.is(form.get('simple').name, 'simple');
});

test.only('form is built correctly', t => {
  const form = Form.create([
    'a',
    { name: 'b' },
    field('c'),
    hasOne('d', [
      'e',
      hasOne('f', [{ name: 'g' }]),
      hasMany('h', [field('i')])
    ]),
    hasMany('j', [
      'k',
      hasOne('l', ['m']),
      hasMany('n', [field('o')])
    ])
  ]);

  console.log(form.get('d'));

  form.getIn(['d', 'h']).add();
  form.getIn(['j', 'n']).add();
  form.getIn(['j', 'n']).add();

  const coordinates = [{
    type: Field,
    paths: [
      ['a'],
      ['b'],
      ['c'],
      ['d', 'e'],
      ['d', 'f', 'g'],
      ['d', 'h', 0, 'i'],
      ['j', 'k'],
      ['j', 'l', 'm'],
      ['j', 'n', 1, 'o']
    ]
  }];

  coordinates.forEach(({ type, paths }) => {
    paths.forEach(path => {
      t.true(form.getIn(path) instanceof Field);
      t.is(form.getIn(path).name, path[path.length - 1]);
    });
  });
});
