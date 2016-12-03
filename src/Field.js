import { extendObservable } from 'mobx';

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
      value: initial
    });
  }

  get isBoolean () {
    return this.type === 'boolean';
  }

  set = (value) => {
    this.value = value;
  }

  reset = () => {
    this.set(this.initial);
  }

  handleChange = (eventOrValue) => {
    if (eventOrValue.target) {
      if (this.isBoolean) {
        this.value = eventOrValue.target.checked;
      } else {
        this.value = eventOrValue.target.value;
      }
    } else {
      this.value = eventOrValue;
    }
  }
}
