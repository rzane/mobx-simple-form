import test from 'ava';
import { useStrict } from 'mobx';
import Form, {
  field,
  hasOne,
  Field
} from '../../src';

test.before(() => {
  useStrict(true);
});

test('create', t => {
  const form = Form.create([
    'name',
    field('email'),
    hasOne('address', [
      'line1',
      field('line2'),
      hasOne('city', ['name'])
    ])
  ]);

  const coordinates = [
    ['name'],
    ['email'],
    ['address', 'line1'],
    ['address', 'line2'],
    ['address', 'city', 'name']
  ];

  coordinates.forEach((coordinate) => {
    t.true(form.getIn(coordinate) instanceof Field);
    t.is(form.getIn(coordinate).name, coordinate[coordinate.length - 1]);
  });
});
