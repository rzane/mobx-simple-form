import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import Devtools from 'mobx-react-devtools';
import Head from 'next/head';

const Page = ({ children }) => (
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
        {children}
      </div>
    </section>
  </div>
);

Page.propTypes = {
  children: PropTypes.node.isRequired
};

export default observer(Page);
