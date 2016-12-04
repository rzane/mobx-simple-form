import { action, extendObservable } from 'mobx';
import { getCaster } from './casters';

export default class FieldStore {
  constructor({ name, type, initial = '' }) {
    if (!name) {
      throw new Error('A field must have a name.');
    }

    Object.assign(this, {
      name,
      initial,
      type,
      cast: getCaster(type),
    });

    extendObservable(this, {
      value: initial,
      isFocused: false
    });
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
    this.set(this.cast(eventOrValue));
  })
}
