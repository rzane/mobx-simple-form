import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import css from 'next/css';
import Field from './Field';

const fieldset = css({
  border: 0,
  padding: 0,
  marginBottom: 30
});

const legend = css({
  fontSize: 20,
  marginBottom: 15
});

const UserForm = ({ form, onSubmit }) => (
  <form onSubmit={onSubmit}>
    <fieldset {...fieldset}>
      <legend {...legend}>Basic</legend>

      <Field
        type='text'
        label='First name'
        field={form.get('firstName')}
      />

      <Field
        type='text'
        label='Last name'
        field={form.get('lastName')}
      />

      <Field
        type='text'
        label='Email address'
        field={form.get('email')}
      />
    </fieldset>

    <fieldset {...fieldset}>
      <legend {...legend}>Address</legend>

      <Field
        type='text'
        label='Street'
        field={form.getIn(['address', 'street'])}
      />

      <Field
        type='text'
        label='City'
        field={form.getIn(['address', 'city'])}
      />
    </fieldset>

    <fieldset {...fieldset}>
      <legend {...legend}>Contacts</legend>

      {form.get('contacts').map((field, i) => (
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

          <div className='column is-2' {...css({ alignSelf: 'center' })}>
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
        onClick={form.get('contacts').handleAdd}
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
        onClick={form.handleReset}
      >
        Reset
      </button>
    </p>
  </form>
);

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  form: PropTypes.shape({
    get: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired
  })
};

export default observer(UserForm);
