import Form from './stores/Form';

export * from './casters';
export * from './validations';

export { default as Field } from './stores/Field';
export { default as FieldObject } from './stores/FieldObject';
export { default as FieldArray } from './stores/FieldArray';

export { default as field } from './fields/field';
export { default as hasOne } from './fields/hasOne';

export const hasMany = (name, fields) => {
  return {
    name,
    fields,
    type: 'array'
  };
};

export default Form;
