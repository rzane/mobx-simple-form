import { isEmpty } from './utils';

export const presence = (field) => {
  if (isEmpty(field.value)) {
    return "can't be blank";
  }
};
