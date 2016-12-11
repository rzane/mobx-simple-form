import Field from './stores/Field';
import FieldArray from './stores/FieldArray';
import FieldObject from './stores/FieldObject';
import Form from './stores/Form';
import { assert, isString, isArray, isObject } from './utils';

const buildField = (config) => {
  if (isString(config)) {
    return new Field({ name: config });
  }

  if (isObject(config) && config.field) {
    const FieldType = config.field;

    if (config.fields) {
      const fields = config.fields.map(buildField);
      return new FieldType({ ...config, fields });
    } else {
      return new FieldType(config);
    }
  }

  throw new Error(`Invalid field configuration: ${JSON.stringify(config)}`);
};

export const field = (name, config) => {
  assert(isString(name), '`field` expects a name.');

  return {
    name,
    ...config,
    field: Field
  };
};

export const hasOne = (name, fields) => {
  assert(isString(name), '`hasOne` expects a name.');
  assert(isArray(fields), '`hasOne` expects an array of fields');

  return {
    name,
    fields,
    field: FieldObject
  };
};

export const hasMany = (name, fields, options) => {
  assert(isArray(fields), '`hasMany` expects an array of fields');

  return {
    name,
    ...options,
    field: FieldArray,
    buildFields (name) {
      return buildField(hasOne(name, fields));
    }
  };
};

export default (fields) => {
  assert(isArray(fields), '`form` expects an array of fields');

  return new Form({
    fields: fields.map(buildField)
  });
};
