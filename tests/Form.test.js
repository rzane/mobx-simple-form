import test from 'ava';
import { useStrict } from 'mobx';
import { Form, Field } from '../src';

test.before(() => {
  useStrict(true);
});

test('get', t => {
  const form = new Form([{ name: 'username' }]);
  t.true(form.get('username') instanceof Field);
});

test('assign', t => {
  const form = new Form([{ name: 'username' }]);
  form.assign({ username: 'meatloaf' });
  t.is(form.get('username').value, 'meatloaf');
});

test('reset', t => {
  const form = new Form([{
    name: 'username',
    initial: 'foo'
  }]);

  form.assign({ username: 'bar' });
  t.is(form.get('username').value, 'bar');

  form.reset();
  t.is(form.get('username').value, 'foo');
});
