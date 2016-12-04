import { action, extendObservable } from 'mobx';
import { getCaster } from './casters';

export default class FieldStore {
  constructor({ name, type, initial = '', validate = [] }) {
    if (!name) {
      throw new Error('A field must have a name.');
    }

    Object.assign(this, {
      name,
      initial,
      type,
      cast: getCaster(type),
      validations: validate
    });

    extendObservable(this, {
      error: null,
      value: initial,
      isFocused: false
    });
  }

  get isValid () {
    return !this.error;
  }

  reset = () => {
    this.set(this.initial);
  }

  set = action((value) => {
    this.value = value;
    this.validate();
  })

  setError = action((error) => {
    this.error = error;
  })

  handleFocus = action(() => {
    this.isFocused = true;
  })

  handleBlur = action(() => {
    this.isFocused = false;
  })

  handleChange = action((eventOrValue) => {
    this.set(this.cast(eventOrValue));
  })

  validate = action(() => {
    const isValid = this.validations.every((validation) => {
      const error = validation(this);

      if (error) {
        this.setError(error);
        return false
      }

      return true;
    });

    if (isValid) {
      this.setError(null);
    }

    return isValid;
  })
}
