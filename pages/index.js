import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Devtools from 'mobx-react-devtools';
import Head from 'next/head';
import UserForm from './UserForm';
import Preview from './Preview';
import { form, field, hasOne, hasMany, presence } from '../lib';

/**
 * Create our form instance.
 */
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

class App extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(userForm.values);
  }

  componentWillMount () {
    userForm.set({ firstName: 'Ray', lastName: 'Zane' });
  }

  componentWillUnmount () {
    userForm.reset();
  }

  render () {
    return (
      <div>
        <Head>
          <title>MobX Simple Form</title>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.2.3/css/bulma.min.css' />
          <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' />
        </Head>

        <section className='hero is-primary'>
          <Devtools />
          <div className='hero-body'>
            <div className='container'>
              <h1 className='title'>
                MobX Simple Form
              </h1>
            </div>
          </div>
        </section>

        <section className='section'>
          <div className='container'>
            <div className='columns'>
              <div className='column is-two-thirds'>
                <UserForm
                  form={userForm}
                  onSubmit={this.handleSubmit}
                />
              </div>
              <div className='column is-one-third'>
                <Preview form={userForm} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default observer(App);
