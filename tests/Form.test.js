import test from 'ava';
import { useStrict } from 'mobx';
import Form from '../src';

test.before(() => {
  useStrict(true);
});

test('create', t => {
  const form = Form.create(['simple']);
  t.is(form.get('simple').name, 'simple');
});
