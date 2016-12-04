import { map, action } from 'mobx';
import Field from './Field';

const traverse = (form, fn) => form.fields.values().reduce((acc, field) => ({
  ...acc,
  [field.name]: fn(field)
}), {});

const mapWithField = (form, object, fn) => Object.keys(object).forEach(name => {
  const field = form.get(name);
  if (field) fn(field, object[name]);
});

export default class Form {
  constructor (fields) {
    this.fields = map(fields.reduce((obj, field) => ({
      [field.name]: new Field(field)
    }), {}));
  }

  get (name) {
    return this.fields.get(name);
  }

  get values () {
    return traverse(this, field => field.value);
  }

  get errors () {
    return traverse(this, field => field.error);
  }

  get isValid () {
    return this.fields.values().every(field => field.isValid);
  }

  assign = action((values) => {
    mapWithField(this, values, (field, value) => field.set(value));
  })

  assignErrors = action((errors) => {
    mapWithField(this, errors, (field, error) => field.setError(error));
  })

  reset = action((values) => {
    this.fields.values().forEach(field => field.reset());
  })

  validate = action(() => {
    return this.fields.values().every(field => field.validate());
  });
}
