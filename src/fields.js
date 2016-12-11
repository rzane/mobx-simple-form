import Field from './stores/Field';
import FieldArray from './stores/FieldArray';
import FieldObject from './stores/FieldObject';
import Form from './stores/Form';
import { assert, isString, isArray, isObject } from './utils';

const getName = (parentName, childName) => (
  parentName ? `${parentName}[${childName}]` : childName
);

const buildFieldFromConfig = (parentName, {
  name,
  fields,
  field: FieldType,
  ...config
}) => {
  const inputName = getName(parentName, name);

  if (fields) {
    config.fields = buildFields(inputName, fields);
  }

  return new FieldType({
    ...config,
    name,
    inputName
  });
};

const buildField = (parentName, config) => {
  if (isString(config)) {
    return new Field({
      name: config,
      inputName: getName(parentName, config)
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

export const field = (name, config) => {
  assert(isString(name), '`field` expects a name.');

  return {
    name,
    field: Field,
    ...config
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

  const buildFields = (parentName, index) => {
    const config = hasOne(index.toString(), fields);
    return buildField(parentName, config);
  };

  return {
    name,
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
