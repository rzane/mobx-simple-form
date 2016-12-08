import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FormPage from './components/FormPage';
import { form } from '../lib';

class CompanyForm extends Component {
  form = form(['name', 'city'])

  handleSubmit = (event) => {
    event.preventDefault();

    this.form.validate();

    if (this.form.isValid) {
      console.log('success', this.form.values());
    } else {
      console.log('invalid', this.form.errors());
    }
  }

  render () {
    const name = this.form.get('name');
    const city = this.form.get('city');

    return (
      <FormPage form={this.form}>
        <form onSubmit={this.handleSubmit}>
          <p className='control'>
            <label
              className='label'
              htmlFor={name.name}
            >
              Name
            </label>
            <input
              name={name.name}
              value={name.value}
              className='input'
              onChange={name.handleChange}
            />
          </p>

          <p className='control'>
            <label
              className='label'
              htmlFor={name.name}
            >
              City
            </label>
            <input
              name={city.name}
              value={city.value}
              className='input'
              onChange={city.handleChange}
            />
          </p>

          <button type='submit' className='button is-primary'>
            Save
          </button>

          <button type='button' onClick={this.form.handleReset} className='button is-link'>
            Reset
          </button>
        </form>
      </FormPage>
    );
  }
}

export default observer(CompanyForm);
