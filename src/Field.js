import { action, extendObservable } from 'mobx';
import { getCaster } from './casters';
import { isEmpty } from './utils';

export default class FieldStore {
  constructor ({ name, type, initial = '', validate = [] }) {
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

  /**
   * Computed properties
   */

  get isValid () {
    return !this.error;
  }

  get isEmpty () {
    return isEmpty(this.value);
  }

  /**
   * Actions
   */

  reset = action(() => {
    this.set(this.initial);
    this.setError(null);
  })

  set = action((value, options = {}) => {
    this.value = value;

    if (options.validate !== false) {
      this.validate();
    }
  })

  setError = action((error) => {
    this.error = error;
  })

  // This just makes recursion easier
  setErrors (error) {
    this.setError(error);
  }

  focus = action(() => {
    this.isFocused = true;
  })

  blur = action(() => {
    this.isFocused = false;
    this.validate();
  })

  validate = action(() => {
    const isValid = this.validations.every((validation) => {
      const error = validation(this);

      if (error) {
        this.setError(error);
        return false;
      }

      return true;
    });

    if (isValid) {
      this.setError(null);
    }

    return isValid;
  })

  /**
   * Event handlers
   */

  handleFocus = () => {
    this.focus();
  }

  handleBlur = () => {
    this.blur();
  }

  handleChange = (eventOrValue) => {
    this.set(this.cast(eventOrValue));
  }
}
