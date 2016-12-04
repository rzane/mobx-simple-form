export const castString = (value) => String(value);
export const castNumber = (value) => Number(value);
export const castBoolean = (value) => Boolean(value);

export const castDefault = (eventOrValue) => {
  if (eventOrValue && eventOrValue.target) {
    if (eventOrValue.target.type === 'checkbox') {
      return eventOrValue.target.checked;
    }

    return eventOrValue.target.value;
  }

  return eventOrValue;
};

export const getCaster = (type) => {
  if (typeof type === 'function') {
    return type;
  }

  switch (type) {
    case 'string':
      return castString;
    case 'number':
      return castNumber;
    case 'boolean':
      return castBoolean;
    default:
      return castDefault;
  }
};
