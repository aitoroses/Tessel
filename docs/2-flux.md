# Tessel Flux

Version 1.2 comes with support for ES6+ class stores and actions.

Each store context it's namespaced inside the tessel instance and actions should be implemented for each store. All actions are asynchronous.

```js

var tessel = new Tessel({
  identity: {
    profile: null
  }
});

// Example Store Class
class IdentityStore {

  // ES7 property initializers
  state = {
    profile: 'my-profile'
  }

  // Bind to tessel namespaced section
  constructor() {
    this.bindState('identity');
  }

  getValue() {
    return this.state.profile;
  }
}

// Example Actions Class
class IdentityActions {
  change(profile, resolve, reject) {
    // State keeps being immutable
    var updated = this.set('profile', profile);
    resolve(updated);
  }
}

// Now we generate the instances
var store = tessel.createStore(IdentityStore);
var actions = store.createActions(IdentityActions);

store.getValue() // => "my-profile"

store.on('update', () => {
  store.getValue() // => "my-new-profile"
});

actions.change("my-new-profile")
  .then((res) => {
    store.getValue() // => "my-new-profile"
    res              // => "my-new-profile"
  });

store.getValue() // => "my-profile"

```
