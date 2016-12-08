import { extendObservable, action } from 'mobx';
import { assert, isEmpty, getFieldRecursive } from '../utils';

const eachWithField = (parent, object, fn) => {
  return Object.keys(object).forEach(name => {
    const field = parent.get(name);
    if (field) fn(field, object[name]);
  });
};

export default class FieldObject {
  constructor ({ name, fields }) {
    this.name = name;

    this.indexedFields = fields.reduce(
      (acc, f) => ({ ...acc, [f.name]: f }),
      {}
    );

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

  get (name) {
    return this.indexedFields[name];
  }

  getIn (names) {
    return getFieldRecursive(this, names);
  }

  values () {
    return this.fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.values ? field.values() : field.value
    }), {});
  }

  errors () {
    return this.fields.reduce((acc, field) => {
      const error = field.errors ? field.errors() : field.error;
      return isEmpty(error) ? acc : { ...acc, [field.name]: error };
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
