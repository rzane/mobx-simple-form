# MobX Simple Form

```javascript
import { form, hasMany } from 'mobx-simple-form';

const myForm = form([
  'company',
  hasMany('products', ['name'])
]);

const Input = ({ field }) => (
  <input
    name={field.name}
    value={field.value}
    onChange={field.handleChange}
  />
);

const MyComponent = () => (
  <form onSubmit={() => console.log(myForm.values())}>
    <Input field={myForm.get('company')} />

    {myForm.get('products').map(product =>
      <div key={product.name}>
        <Input field={product.get('name')} />

        <button onClick={product.handleRemove}>
          Remove Friend
        </button>
      </div>
    )}

    <button onClick={myForm.get('products').handleAdd}>
      Add Friend
    </button>
  </form>
);
```
