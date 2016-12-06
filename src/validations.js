import { isEmpty } from './utils';

export const createValidator = (validator) => (opts = {}) => (field) => {
  const defaultMessage = validator(field, opts);

  if (defaultMessage) {
    return opts.message || defaultMessage;
  }
};

export const presence = createValidator((field) => {
  if (isEmpty(field.value)) {
    return "can't be blank";
  }
});
