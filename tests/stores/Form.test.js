import test from 'ava';
import { useStrict } from 'mobx';
import Form, {
  field,
  hasOne,
  hasMany,
  Field
} from '../../src';

test.before(() => {
  useStrict(true);
});

test('create', t => {
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

  form.getIn(['d', 'h']).add();
  form.getIn(['j']).add();
  form.getIn(['j', 0, 'n']).add();
  form.getIn(['j', 0, 'n']).add();

  const coordinates = [
    ['a'],
    ['b'],
    ['c'],
    ['d', 'e'],
    ['d', 'f', 'g'],
    ['d', 'h', 0, 'i'],
    ['j', 0, 'k'],
    ['j', 0, 'l', 'm'],
    ['j', 0, 'n', 1, 'o']
  ];

  coordinates.forEach((coordinate) => {
    t.true(form.getIn(coordinate) instanceof Field);
    t.is(form.getIn(coordinate).name, coordinate[coordinate.length - 1]);
  });
});
