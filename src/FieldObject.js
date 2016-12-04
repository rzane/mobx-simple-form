import { map, action } from 'mobx';
import Field from './Field';
import FieldArray from './FieldArray';

const traverse = (field, fn) => field.fields.values().reduce((acc, field) => ({
  ...acc,
  [field.name]: fn(field)
}), {});

const buildField = (field) => {
  if (field.fields && !field.type) {
    throw new Error('Nested fields must declare a type of either `object` or `array`.');
  }

  if (field.fields && field.type === 'object') {
    return new FieldObject(field);
  }

  if (field.fields && field.type === 'array') {
    return new FieldArray(field);
  }

  return new Field(field);
};

const buildFields = (fields) => fields.reduce((obj, field) => ({
  ...obj,
  [field.name]: buildField(field)
}), {});

export const eachWithField = (fieldObject, object, fn) => Object.keys(object).forEach(name => {
  const field = fieldObject.get(name);
  if (field) fn(field, object[name]);
});

export default class FieldObject {
  constructor ({ name, fields }) {
    this.name = name;
    this.fields = map(buildFields(fields));
  }

  get (name) {
    return this.fields.get(name);
  }

  getIn (names) {
    return names.reduce((field, name) => field ? field.get(name) : null, this);
  }

  get values () {
    return traverse(this, field => field.values || field.value);
  }

  get errors () {
    return traverse(this, field => field.errors || field.error);
  }

  get isValid () {
    return this.fields.values().every(field => field.isValid);
  }

  set = action((values) => {
    eachWithField(this, values, (field, value) => field.set(value));
  })

  setErrors = action((errors) => {
    eachWithField(this, errors, (field, error) => field.setErrors(error));
  })

  reset = action((values) => {
    this.fields.values().forEach(field => field.reset());
  })

  validate = action(() => {
    return this.fields.values().every(field => field.validate());
  })
}
