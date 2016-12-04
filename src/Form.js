import { map, action } from 'mobx';
import Field from './Field';

export default class Form {
  constructor (fields) {
    this.fields = map(fields.reduce((obj, field) => ({
      [field.name]: new Field(field)
    }), {}));
  }

  get (name) {
    return this.fields.get(name);
  }

  get isValid () {
    return this.fields.values().every(field => field.isValid);
  }

  mapWithField (object, fn) {
    Object.keys(object).forEach(name => {
      const field = this.get(name);

      if (field) {
        fn(field, object[name]);
      }
    });
  }

  assign = action((values) => {
    this.mapWithField(values, (field, value) => field.set(value));
  })

  assignErrors = action((errors) => {
    this.mapWithField(errors, (field, error) => field.setError(error));
  })

  reset = action((values) => {
    this.fields.values().forEach(field => field.reset());
  })

  validate = action(() => {
    return this.fields.values().every(field => field.validate());
  });
}
