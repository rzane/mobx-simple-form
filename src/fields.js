import Field from './stores/Field';
import FieldArray from './stores/FieldArray';
import FieldObject from './stores/FieldObject';
import Form from './stores/Form';
import { assert, isString, isArray, isObject } from './utils';

const getName = (parentName, key) => (
  parentName ? `${parentName}[${key}]` : key
);

const buildFieldFromConfig = (parentName, {
  key,
  fields,
  field: FieldType,
  ...config
}) => {
  const name = getName(parentName, key);

  if (fields) {
    config.fields = buildFields(name, fields);
  }

  return new FieldType({ key, name, ...config });
};

const buildField = (parentName, config) => {
  if (isString(config)) {
    return new Field({
      key: config,
      name: getName(parentName, config)
    });
  }

  if (isObject(config) && config.field) {
    return buildFieldFromConfig(parentName, config);
  }

  throw new Error(`Invalid field configuration: ${JSON.stringify(config)}`);
};

const buildFields = (parentName, configs) => {
  return configs.map(config => buildField(parentName, config));
};

export const field = (key, config) => {
  assert(isString(key), '`field` expects a name.');

  return {
    key,
    field: Field,
    ...config
  };
};

export const hasOne = (key, fields) => {
  assert(isString(key), '`hasOne` expects a name.');
  assert(isArray(fields), '`hasOne` expects an array of fields');

  return {
    key,
    fields,
    field: FieldObject
  };
};

export const hasMany = (key, fields, options) => {
  assert(isString(key), '`hasMany` expects a name.');
  assert(isArray(fields), '`hasMany` expects an array of fields');

  const buildFields = (parentName, index) => {
    const config = hasOne(index.toString(), fields);
    return buildField(parentName, config);
  };

  return {
    key,
    buildFields,
    field: FieldArray,
    ...options
  };
};

export default (fields) => {
  assert(isArray(fields), '`form` expects an array of fields');

  return new Form({
    fields: fields.map(config => buildField(null, config))
  });
};
