import React from 'react';
import { observer } from 'mobx-react';
import FormPage from './components/FormPage';
import Field from './components/Field';
import { fieldset, legend } from './components/style';
import { form, field, hasOne, hasMany, presence } from '../lib';

const userForm = form([
  'firstName',
  'lastName',
  field('email', {
    validate: [
      presence({ message: 'We need to contact you!' })
    ]
  }),
  hasOne('address', ['street', 'city']),
  hasMany('contacts', [
    'name',
    field('email', {
      validate: [
        presence()
      ]
    })
  ])
]);

const onSubmit = () => {
  userForm.validate();

  if (userForm.isValid) {
    console.log('success', userForm.values());
  } else {
    console.log('invalid', userForm.errors());
  }
};

const UserForm = () => (
  <FormPage form={userForm}>
    <form onSubmit={onSubmit}>
      <fieldset {...fieldset}>
        <legend {...legend}>Basic</legend>

        <Field
          type='text'
          label='First name'
          field={userForm.get('firstName')}
        />

        <Field
          type='text'
          label='Last name'
          field={userForm.get('lastName')}
        />

        <Field
          type='text'
          label='Email address'
          field={userForm.get('email')}
        />
      </fieldset>

      <fieldset {...fieldset}>
        <legend {...legend}>Address</legend>

        <Field
          type='text'
          label='Street'
          field={userForm.getIn(['address', 'street'])}
        />

        <Field
          type='text'
          label='City'
          field={userForm.getIn(['address', 'city'])}
        />
      </fieldset>

      <fieldset {...fieldset}>
        <legend {...legend}>Contacts</legend>

        {userForm.get('contacts').map((field, i) => (
          <div className='columns' key={i}>
            <div className='column is-5'>
              <Field
                type='text'
                label='Name'
                field={field.get('name')}
              />
            </div>

            <div className='column is-5'>
              <Field
                type='text'
                label='Email'
                field={field.get('email')}
              />
            </div>

            <div className='column is-2'>
              <button
                type='button'
                className='button'
                onClick={field.handleRemove}
              >
                <span className='icon'>
                  <i className='fa fa-trash'/>
                </span>
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}

        <button
          type='button'
          className='button'
          onClick={userForm.get('contacts').handleAdd}
        >
          <span className='icon'>
            <i className='fa fa-user-plus'/>
          </span>
          <span>Add contact</span>
        </button>
      </fieldset>

      <p className='control'>
        <button
          type='submit'
          className='button is-primary'
        >
          Save
        </button>
        <button
          type='button'
          className='button is-link'
          onClick={userForm.handleReset}
        >
          Reset
        </button>
      </p>
    </form>
  </FormPage>
);

export default observer(UserForm);
