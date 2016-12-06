import Form, { presence } from '../lib';

export default new Form({
  fields: [{
    name: 'firstName',
    validate: [presence()]
  }, {
    name: 'lastName',
    validate: [presence()]
  }, {
    name: 'address',
    type: 'object',
    fields: [{
      name: 'street',
      validate: [presence()]
    }, {
      name: 'city',
      validate: [presence()]
    }]
  }, {
    name: 'contacts',
    type: 'array',
    fields: [{
      name: 'name',
      validate: [presence()]
    }, {
      name: 'email',
      validate: [presence()]
    }]
  }]
});
