import FieldObject from './FieldObject';

export default class Form extends FieldObject {
  handleReset = () => {
    this.reset();
  }
}
