import { action, extendObservable } from 'mobx';

export default class Field {
  constructor({ name, type, initial = '' }) {
    if (!name) {
      throw new Error('A field must have a name.');
    }

    Object.assign(this, {
      name,
      type,
      initial
    });

    extendObservable(this, {
      value: initial,
      isFocused: false
    });
  }

  get isBoolean () {
    return this.type === 'boolean';
  }

  reset = () => {
    this.set(this.initial);
  }

  set = action((value) => {
    this.value = value;
  })

  handleFocus = action(() => {
    this.isFocused = true;
  })

  handleBlur = action(() => {
    this.isFocused = false;
  })

  handleChange = action((eventOrValue) => {
    if (eventOrValue.target) {
      if (this.isBoolean) {
        this.value = eventOrValue.target.checked;
      } else {
        this.value = eventOrValue.target.value;
      }
    } else {
      this.value = eventOrValue;
    }
  })
}
