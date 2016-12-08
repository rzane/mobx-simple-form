import { buildFields } from '../fields/hasOne';
import FieldObject from './FieldObject';

export default class Form extends FieldObject {
  static create (fields) {
    return new Form({
      fields: buildFields(fields)
    });
  }

  handleReset = () => {
    this.reset();
  }
}
