import { action, extendObservable } from 'mobx';
import { assert, getFieldRecursive } from '../utils';

export default class FieldArray {
  constructor ({ key, name, buildFields, initialCount = 0 }) {
    assert(key, 'FieldArray must have a key.');
    assert(name, 'FieldArray must have a name.');

    Object.assign(this, {
      key,
      name,
      initialCount,
      buildFields
    });

    extendObservable(this, {
      fields: [],

      get isValid () {
        return this.fields.every(field => field.isValid);
      }
    });

    Array.from(Array(initialCount)).forEach(this.handleAdd);
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

  getIn (keys) {
    return getFieldRecursive(this, keys);
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
   * Actions
   */

  add = action('FieldArray.add', (extra) => {
    const field = this.buildFields(
      this.name,
      this.fields.length
    );

    // Monkey-patch the field with an event handler
    // to remove the field.
    field.handleRemove = this.remove.bind(this, field);

    this.fields.push(field);
    return field;
  })

  remove = action('FieldArray.remove', (field) => {
    this.fields.remove(field);
  })

  set = action('FieldArray.set', (values) => {
    this.fields.clear();
    values.forEach(value => this.add().set(value));
  })

  setErrors = action('FieldArray.setErrors', (errors) => {
    assert(
      errors.length === this.fields.length,
      'The number of errors does not match the number of fields.'
    );

    errors.forEach((error, index) => this.get(index).setErrors(error));
  })

  reset = action('FieldArray.reset', () => {
    this.fields.clear();
    Array.from(Array(this.initialCount)).forEach(this.handleAdd);
  })

  validate = action('FieldArray.validate', () => {
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
