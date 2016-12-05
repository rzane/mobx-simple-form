export const isEmpty = (value) => {
  if (typeof value === 'undefined') {
    return true;
  }

  if (value === null) {
    return true;
  }

  if (Array.isArray(value) && !value.length) {
    return true;
  }

  if (typeof value === 'object' && !Object.keys(value).length) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  return false;
};

export const getFieldRecursive = (parent, names) => {
  return names.reduce((field, name) => field ? field.get(name) : null, parent);
};

export const eachWithField = (parent, object, fn) => {
  return Object.keys(object).forEach(name => {
    const field = parent.get(name);
    if (field) fn(field, object[name]);
  });
};
