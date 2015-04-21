[![Build Status](https://travis-ci.org/aitoroses/Tessel.svg?branch=master)](https://travis-ci.org/aitoroses/Tessel)

# Tessel

> Mix functional reactive programming with immutable cursors for handling application state.

> Implements a history API

> Implements Flux based architecture

Inpspired by Meteors reactivity and `om`'s cursors, `Tessel` helps you writting stateless components in react providing a wrapper
over Meteors `tracker` and a library like `cortex` called [freezer](https://github.com/arqex/freezer) that provides an immutable tree data structure that is always updated from the root, even if the modification is triggered by one of the leaves, making easier to think in a reactive way.. It keeps simple how you should update your apps state and how you should
react to changes in your applications.

Making use of `tracker` we can create computations that will get invalidated when the tree has changed on the root, running again all the invalidated computations.

Tessel is inspired by [fynx](https://github.com/foss-haas/fynx) idea of lightweigth Flux architecture.


```
╔═════════════════╗     ╔════════╗   ┌────────────┐
║ View Components ║<────╢ Tessel ║   │ Server API │
╚═══╤════╤════════╝     ╚════════╝   └────────────┘
    │    │                   ^                ^
    │    └────────────────┐  └────────────┐   │
    v                     v               │   │
╔═════════════════╗   ╔═════════╗     ┌───┴───┴───┐
║ Pure Components ║   ║ Actions ║<═══>│ Listeners │
╚═════════════════╝   ╚═════════╝     └───────────┘
```

# Installation
Tessel is available as an NPM package

`npm install tessel`

# Usage
Here is an example:

We create a simple data holder

```jsx
import React from 'react';
import Tessel from 'tessel';

// State can be asynchronously requested
var AppState = new Tessel({
  options: ["Monkey", "Gorila", "Giraffe"]
});

```

Main component passes a Tessel cursor to the list component

```jsx
/**
 * Main Component
 */
class MyControllerComponent extends React.Component {

  state = {
    cursor: null
  }

  constructor() {
    Tessel.autorun(() => {
      /**
        Autorun gets executed once, and reactively
        when state get's changed, autorun runs again
        this way we can link tessel with the state
      */
      this.setState({cursor: AppState.get()})
    });
  }

  render() {
    return (
      <ListComponent listCursor={this.state.cursor.options} />
    )
  }
}
```

When we are pushing into the list, the cursor intelligently batches the update and will call autorun on the next tick.

```jsx
/**
 * Render a list
 */
class ListComponent extends React.Component {

  static propTypes = {
    listCursor: React.PropTypes.array.isRequired
  }

  /**
   * At this point we are not modifying the props
   * since we are using immutable data structure
   * it will notify for an update to the tree
   * and autorun will run again and get a new cursor.
   */
  _handleAdd() {
    var node = React.findDOMNode(this.refs.input);
    this.props.listCursor.push(node.value);
  }

  render() {
    return (
      <ul>
        {this.props.listCursor.map( el => <li>{el}</li> )}
      </ul>
      <input ref="input">
      <button onClick={this._handleAdd.bind(this)}>Add</button>
    )
  }
}

// Render the main component
React.render(<MyControllerComponent />, document.body);
```
# React Mixin and Component

Each tessel instance provides a mixin and a ES6 component to implements components
that bind directly to the tessel instances state and handles the lifecycle of the computations.

Component state gets initialized to the stores value, and it automatically sets up
a computation to be run each time the state gets updated.

This should work well with reacts **PureRenderMixin** for only updating components
when the store state changes.

```js
var AppState = new Tessel({
  options: ["Monkey", "Gorila", "Giraffe"]
});

// AppState.mixin
var MyComponent = React.createClass({
  mixins: [AppState.mixin],
  render() {
    return (
      <ul>
        {this.state.options.map( el => <li>{el}</li> )}
      </ul>
    )
  }
});  

// AppState.Component
class MyComponent extends AppState.Component {
  render() {
    return (
      <ul>
        {this.state.options.map( el => <li>{el}</li> )}
      </ul>
    )
  }
}
```


# Using the history API

Tessel stores can save, undo and redo its state of course. For example:

```js
var store = new Tessel({
  value: "My value"
});

// Here we can save the state
store.save();

// at some point we modify it
var contents = store.get();
contents.set('value', "Another value");

//...
store.get() // => {value: "Another value"}

// Once this happens the user could restore the previous state by doing
store.undo();

//...
store.get() // => {value: "My value"}

// Since everything it's recorded, the user may want to restore again doing
store.redo();

//...
store.get() // => {value: "Another value"}
```


# How reactivity is triggered

Reactivity internally works the same as Meteor:

We create a Tessel instance

```js
var store = new Tessel({
  data: {
      message: "Hello World"
  }
});
```

Then we create a computation

```js
Tessel.autorun(() => {
  var state = store.get(); // This line should be called
  console.log(state.data.message);
});

// => "Hello World"
```

At this point if the state is modified, the computation will get invalidated and will run again on the nextTick

```js
// The change will get batched
state.data.set('message', "Hello Again");

console.log(state.data.message); // => Hello World

// ... onNextTick when the structure runs the update, previously created computation will run again
// => Hello Again
state.data.message == "Hello Again"; // true
```

# Tessel Actions

Tessel implements [axn](https://github.com/pluma/axn), a small-ish implementation of listenable actions or signals in JavaScript.

This provides a good way of creating "Flux like actions".

Actions should be used to manipulate the stores state or to communicate with the server

Tessel has 2 main APIs:

- Synchronous actions

```js
var actions = Tessel.createActions(["hitMe"])

actions.hitMe.listen((payload) => {
  console.log("HIT ME");
});

actions.hitMe(somePayload);

// => HIT ME
```

- Asynchronous actions

```js
var actions = Tessel.createAsyncActions(["hitMe"])

actions.hitMe.listen((payload) => {
  console.log("HIT ME");
});

actions.hitMe.listen(() => anyKindOfPromise);

var promise = actions.hitMe(somePayload);
promise.then((promiseResult) => {
  // promiseResult is the value that "anyKindOfPromise" was resolved to.
  console.log("HIT ME AGAIN");
});

// The two listeners will be executed on cascade

// => HIT ME
// => HIT ME AGAIN
```

Asynchronous actions are good if we have a promise based **Server API** so that we
can express our entire logic using this actions and using that API promises..

# Liscense
`Tessel` is governed under the MIT License.
