import { action, extendObservable } from 'mobx';
import createCaster from '../createCaster';
import { assert, isEmpty } from '../utils';

export default class Field {
  constructor ({ name, type, initial = '', validate = [] }) {
    assert(name, 'A field must have a name.');

    Object.assign(this, {
      name,
      initial,
      type,
      cast: createCaster(type),
      validations: validate
    });

    extendObservable(this, {
      error: null,
      value: initial,
      isFocused: false,

      get isValid () {
        return !this.error;
      },

      get isEmpty () {
        return isEmpty(this.value);
      }
    });
  }

  /**
   * Actions
   */

  reset = action('Field.reset', () => {
    this.set(this.initial);
    this.setError(null);
  })

  set = action('Field.set', (value, options = {}) => {
    this.value = value;

    if (options.validate !== false) {
      this.validate();
    }
  })

  setError = action('Field.setError', (error) => {
    this.error = error;
  })

  // This just makes recursion easier
  setErrors (error) {
    this.setError(error);
  }

  focus = action('Field.focus', () => {
    this.isFocused = true;
  })

  blur = action('Field.blur', () => {
    this.isFocused = false;
    this.validate();
  })

  validate = action('Field.validate', () => {
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

  handleChange = (...args) => {
    this.set(this.cast(...args));
  }
}
