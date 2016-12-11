import { extendObservable, action } from 'mobx';
import { assert, isEmpty, getFieldRecursive } from '../utils';

const eachWithField = (parent, object, fn) => {
  return Object.keys(object).forEach(key => {
    const field = parent.get(key);
    if (field) fn(field, object[key]);
  });
};

export default class FieldObject {
  constructor ({ key, name, fields }) {
    this.indexedFields = fields.reduce(
      (acc, f) => ({ ...acc, [f.key]: f }),
      {}
    );

    Object.assign(this, {
      key,
      name
    });

    extendObservable(this, {
      fields,

      get isValid () {
        return this.fields.every(field => field.isValid);
      }
    });
  }

  /**
   * Methods
   */

  get (key) {
    return this.indexedFields[key];
  }

  getIn (keys) {
    return getFieldRecursive(this, keys);
  }

  values () {
    return this.fields.reduce((acc, field) => ({
      ...acc,
      [field.key]: field.values ? field.values() : field.value
    }), {});
  }

  errors () {
    return this.fields.reduce((acc, field) => {
      const error = field.errors ? field.errors() : field.error;
      return isEmpty(error) ? acc : { ...acc, [field.key]: error };
    }, {});
  }

  /**
   * Actions
   */

  set = action('FieldObject.set', (values) => {
    eachWithField(this, values, (field, value) => field.set(value));
  })

  setErrors = action('FieldObject.setErrors', (errors) => {
    eachWithField(this, errors, (field, error) => field.setErrors(error));
  })

  reset = action('FieldObject.reset', () => {
    this.fields.forEach(field => field.reset());
  })

  validate = action('FieldObject.validate', () => {
    this.fields.forEach(field => field.validate());
  })

  /**
   * Event handlers
   */

  handleReset = () => {
    this.reset();
  }

  // This will be overridden in `FieldArray.add`
  handleRemove = () => {
    assert(false, "This field is not part of a FieldArray, and therefore can't be removed");
  }
}
