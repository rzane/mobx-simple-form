const CASTERS = {
  string: (value) => String(value),
  number: (value) => Number(value),
  boolean: (value) => Boolean(value),
  noop: (value) => value
};

const getCaster = (type) => {
  const caster = CASTERS[type];

  if (type && !caster) {
    throw new Error(`'${type}' is not a valid field type`);
  }

  return caster || CASTERS.noop;
};

const extractValue = (eventOrValue) => {
  if (eventOrValue && eventOrValue.target) {
    if (eventOrValue.target.type === 'checkbox') {
      return eventOrValue.target.checked;
    }

    return eventOrValue.target.value;
  }

  return eventOrValue;
};

const createCaster = (type) => {
  if (typeof type === 'function') {
    return type;
  }

  const cast = getCaster(type);

  return (eventOrValue) => cast(
    extractValue(eventOrValue)
  );
};

export default createCaster;
