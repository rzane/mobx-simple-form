const typecheck = (value, type) => typeof value === type;

export const isString = (value) => typecheck(value, 'string');
export const isNumber = (value) => typecheck(value, 'number');
export const isUndefined = (value) => typecheck(value, 'undefined');
export const isObject = (value) => typecheck(value, 'object');
export const isFunction = (value) => typecheck(value, 'function');

export const isNull = (value) => value === null;
export const isArray = (value) => Array.isArray(value);
export const isEmptyString = (value) => isString(value) && value.trim() === '';
export const isEmptyArray = (value) => isArray(value) && !value.length;
export const isEmptyObject = (value) => isObject(value) && !Object.keys(value).length;

export const isEmpty = (value) => (
  isUndefined(value) ||
    isNull(value) ||
    isEmptyString(value) ||
    isEmptyArray(value) ||
    isEmptyObject(value)
);

export const assert = (test, message) => {
  if (!test) throw new Error(message);
};

export const getFieldRecursive = (parent, names) => {
  return names.reduce((field, name) => field ? field.get(name) : null, parent);
};
