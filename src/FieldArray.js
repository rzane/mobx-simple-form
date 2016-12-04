import { action, observable } from 'mobx';
import FieldObject from './FieldObject';

export default class FieldArray {
  constructor (config) {
    this.name = config.name;
    this.config = config;
    this.fields = observable([]);
  }

  get (index) {
    // mobx will complain if we try to read a non-existant index
    if (this.fields.length > index) {
      return this.fields[index];
    }
  }

  get values () {
    return this.fields.map(field => field.values);
  }

  get errors () {
    return this.fields.map(field => field.errors);
  }

  get isValid () {
    return this.fields.every(field => field.isValid);
  }

  add = action((extra) => {
    const field = new FieldObject({
      ...this.config,
      ...extra,
      name: this.fields.length,
    });

    this.fields.push(field);
    return field;
  })

  remove = action((index) => {
    this.fields.splice(index, 1);
  });

  set = action((values) => {
    this.fields.clear();
    values.forEach(value => this.add({ value }).set(value));
  })

  setErrors = action((errors) => {
    if (errors.length !== this.fields.length) {
      throw new RangeError('The number of errors does not match the number of fields.');
    }

    errors.forEach((error, index) => this.get(index).setErrors(error));
  })

  reset = action((values) => {
    this.fields.forEach(field => field.reset());
  })

  validate = action(() => {
    return this.fields.every(field => field.validate());
  })
}
