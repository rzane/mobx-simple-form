const isBlank = (value) => {
  if (typeof value === 'undefined') {
    return true;
  }

  if (value === null) {
    return true;
  }

  if (Array.isArray(value) && !value.length) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  return false;
};

export const presence = (field) => {
  if (isBlank(field.value)) {
    return "can't be blank";
  }
};
