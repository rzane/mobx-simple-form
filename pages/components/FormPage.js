import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import Page from './Page';
import Preview from './Preview';

const FormPage = ({ form, children }) => (
  <Page>
    <div className='columns'>
      <div className='column is-two-thirds'>
        {children}
      </div>
      <div className='column is-one-third'>
        <Preview form={form} />
      </div>
    </div>
  </Page>
);

FormPage.propTypes = {
  form: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default observer(FormPage);
