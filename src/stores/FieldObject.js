import { extendObservable, action } from 'mobx';
import { isEmpty, getFieldRecursive, eachWithField } from '../utils';

export default class FieldObject {
  constructor ({ name, fields }) {
    this.name = name;

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
    return this.fields.find(f => f.name === name);
  }

  getIn (names) {
    return getFieldRecursive(this, names);
  }

  values () {
    return this.fields.values().reduce((acc, field) => ({
      ...acc,
      [field.name]: field.values ? field.values() : field.value
    }), {});
  }

  errors () {
    return this.fields.values().reduce((acc, field) => {
      const error = field.errors ? field.errors() : field.error;
      return isEmpty(error) ? acc : { ...acc, [field.name]: error };
    }, {});
  }

  /**
   * Actions
   */

  set = action('FieldObject.set', (values, options = {}) => {
    eachWithField(this, values, (field, value) => field.set(value, options));
  })

  setErrors = action('FieldObject.setErrors', (errors) => {
    eachWithField(this, errors, (field, error) => field.setErrors(error));
  })

  reset = action('FieldObject.reset', () => {
    this.fields.values().forEach(field => field.reset());
  })

  validate = action('FieldObject.validate', () => {
    this.fields.values().forEach(field => field.validate());
  })

  /**
   * Event handlers
   */

  // This will be overridden in `FieldArray.add`
  handleRemove = () => {
    throw new Error("This field is not part of a FieldArray, and therefore can't be removed");
  }
}
