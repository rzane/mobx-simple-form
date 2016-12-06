import { action, extendObservable } from 'mobx';
import FieldObject from './FieldObject';
import { getFieldRecursive } from './utils';

export default class FieldArray {
  constructor ({ name, initial = [], fields = [] }) {
    Object.assign(this, {
      name,
      initial,
      fieldConfig: fields
    });

    extendObservable(this, {
      fields: [],

      get isValid () {
        return this.fields.every(field => field.isValid);
      }
    });

    if (initial.length) {
      this.reset();
    }
  }

  /**
   * Methods
   */

  get (index) {
    // mobx will complain if we try to read a non-existant index
    if (this.fields.length > index) {
      return this.fields[index];
    }
  }

  getIn (names) {
    return getFieldRecursive(this, names);
  }

  map (fn) {
    return this.fields.map(fn);
  }

  values () {
    return this.fields.map(field => field.values());
  }

  errors () {
    return this.fields
      .map(field => field.errors())
      .filter(errors => Object.keys(errors).length);
  }

  /**
   * Getters
   */

  /**
   * Actions
   */

  add = action((extra) => {
    const field = new FieldObject({
      ...extra,
      name: this.fields.length,
      fields: this.fieldConfig
    });

    field.handleRemove = this.remove.bind(this, field);

    this.fields.push(field);
    return field;
  })

  remove = action((field) => {
    this.fields.remove(field);
  })

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

  reset = action(() => {
    this.set(this.initial);
  })

  validate = action(() => {
    this.fields.forEach(field => field.validate());
  })

  /**
   * Event handlers
   */

  handleAdd = () => {
    this.add();
  }

  handleReset = () => {
    this.reset();
  }
}
