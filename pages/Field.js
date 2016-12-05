import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import css from 'next/css';

const Field = ({ field, label, component: Input, ...props }) => (
  <div {...css({ marginBottom: 15 })}>
    <label htmlFor={field.name} className='label'>
      {label}
    </label>
    <p className='control'>
      <Input
        name={field.name}
        value={field.value}
        onChange={field.handleChange}
        onFocus={field.handleFocus}
        onBlur={field.handleBlur}
        placeholder={label}
        className={`input ${field.error ? 'is-danger' : ''}`}
        {...props}
      />
      {field.error && <span className='help is-danger'>{field.error}</span>}
    </p>
  </div>
);

Field.defaultProps = {
  component: 'input'
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired
  }),
  component: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.func.isRequired
  ])
};

export default observer(Field);
