import FieldObject from './FieldObject';

export default class Form extends FieldObject {
  static create (fields) {
    return new Form({ fields });
  }

  handleReset = () => {
    this.reset();
  }
}
