import Field from '../stores/Field';

const field = (name, config) => {
  return new Field({ name, ...config });
};

export default field;
