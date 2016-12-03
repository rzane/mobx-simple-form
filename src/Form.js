import { map } from 'mobx';
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

  assign = (values) => {
    Object.keys(values).forEach(name => {
      const field = this.get(name);

      if (field) {
        field.set(values[name]);
      }
    });
  }

  reset = (values) => {
    this.fields.values().forEach(field => field.reset());
  }
}
