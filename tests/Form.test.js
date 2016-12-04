import test from 'ava';
import { useStrict } from 'mobx';
import { Form, Field } from '../src';

const makeForm = (config) => (
  new Form([{ name: 'fixture', ...config }])
);

test.before(() => {
  useStrict(true);
});

test('get', t => {
  const form = makeForm();
  t.true(form.get('fixture') instanceof Field);
});

test('values', t => {
  const form = makeForm();
  form.assign({ fixture: 'meatloaf' });
  t.deepEqual(form.values, { fixture: 'meatloaf' });
});

test('errors', t => {
  const form = makeForm();
  form.assignErrors({ fixture: 'invalid' });
  t.deepEqual(form.errors, { fixture: 'invalid' });
});

test('assign', t => {
  const form = makeForm();
  form.assign({ fixture: 'meatloaf' });
  t.is(form.get('fixture').value, 'meatloaf');
});

test('assignErrors', t => {
  const form = makeForm();
  form.assignErrors({ fixture: 'whoa there hoss' });
  t.is(form.get('fixture').error, 'whoa there hoss');
});

test('reset', t => {
  const form = makeForm({ initial: 'foo' });

  form.assign({ fixture: 'bar' });
  t.is(form.get('fixture').value, 'bar');

  form.reset();
  t.is(form.get('fixture').value, 'foo');
});

test('validate', t => {
  const truthy = f => f.value ? null : 'invalid';
  const form = makeForm({ validate: [truthy] });

  form.assign({ fixture: false });
  t.false(form.validate());
  t.false(form.isValid);

  form.assign({ fixture: true });
  t.true(form.validate());
  t.true(form.isValid);
});
