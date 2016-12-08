import field from './field';
import FieldObject from '../stores/FieldObject';

export const buildFields = (fields) => fields.map(config => {
  if (typeof config === 'string') {
    return field(config);
  }

  return config;
});

const hasOne = (name, fields) => {
  return new FieldObject({
    name,
    type: 'object',
    fields: buildFields(fields)
  });
};

export default hasOne;
