import { map, action } from 'mobx';
import Field from './Field';
import FieldArray from './FieldArray';
import { isEmpty, getFieldRecursive, eachWithField } from './utils';

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

  if (typeof field === 'string') {
    return new Field({ name: field });
  }

  return new Field(field);
};

const getFieldName = (field) => (
  typeof field === 'string' ? field : field.name
);

const buildFields = (fields) => fields.reduce((obj, field) => ({
  ...obj,
  [getFieldName(field)]: buildField(field)
}), {});

export default class FieldObject {
  constructor ({ name, fields }) {
    this.name = name;
    this.fields = map(buildFields(fields));
  }

  get (name) {
    return this.fields.get(name);
  }

  getIn (names) {
    return getFieldRecursive(this, names);
  }

  // This will be overridden in `FieldArray.add`
  handleRemove () {
    throw new Error("This field is not part of a FieldArray, and therefore can't be removed");
  }

  get values () {
    return this.fields.values().reduce((acc, field) => ({
      ...acc,
      [field.name]: field.values || field.value
    }), {});
  }

  get errors () {
    return this.fields.values().reduce((acc, field) => {
      const error = field.errors || field.error;
      return isEmpty(error) ? acc : { ...acc, [field.name]: error };
    }, {});
  }

  get isValid () {
    return this.fields.values().every(field => field.isValid);
  }

  set = action((values, options = {}) => {
    eachWithField(this, values, (field, value) => field.set(value, options));
  })

  setErrors = action((errors) => {
    eachWithField(this, errors, (field, error) => field.setErrors(error));
  })

  reset = action(() => {
    this.fields.values().forEach(field => field.reset());
  })

  validate = action(() => {
    return this.fields.values().every(field => field.validate());
  })
}
