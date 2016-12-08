import Field from './stores/Field';
import FieldArray from './stores/FieldArray';
import FieldObject from './stores/FieldObject';
import Form from './stores/Form';
import { assert, isString, isArray, isObject } from './utils';

const FIELD_MARKER = Symbol('field');

const buildField = (config) => {
  if (isString(config)) {
    return new Field({ name: config });
  }

  if (isObject(config) && config[FIELD_MARKER]) {
    return new Field(config);
  }

  return config;
};

export const field = (name, config) => {
  assert(isString(name), '`field` expects a name.');

  return {
    name,
    ...config,
    [FIELD_MARKER]: true
  };
};

export const hasOne = (name, fields) => {
  assert(isString(name), '`hasOne` expects a name.');
  assert(isArray(fields), '`hasOne` expects an array of fields');

  return new FieldObject({
    name,
    fields: fields.map(buildField)
  });
};

export const hasMany = (name, fields, options) => {
  assert(isArray(fields), '`hasMany` expects an array of fields');

  return new FieldArray({
    name,
    ...options,
    buildFields (name) {
      return hasOne(name, fields);
    }
  });
};

export default (fields) => {
  assert(isArray(fields), '`form` expects an array of fields');

  return new Form({
    fields: fields.map(buildField)
  });
};
