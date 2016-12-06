import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Devtools from 'mobx-react-devtools';
import Head from 'next/head';
import UserForm from './UserForm';
import Preview from './Preview';
import form from './form';

class App extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    console.log(form.values);
  }

  componentWillMount () {
    form.set({ firstName: 'Ray', lastName: 'Zane' });
  }

  componentWillUnmount () {
    form.reset();
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
                  form={form}
                  onSubmit={this.handleSubmit}
                />
              </div>
              <div className='column is-one-third'>
                <Preview form={form} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default observer(App);
