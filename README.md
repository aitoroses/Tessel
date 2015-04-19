[![Build Status](https://travis-ci.org/aitoroses/Tessel.svg?branch=master)](https://travis-ci.org/aitoroses/Tessel)

# Tessel

> Mix functional reactive programming with immutable cursors for handling application state. 

Inpspired by Meteors reactivity and `om`'s cursors, `Tessel` helps you writting stateless components in react providing a wrapper 
over Meteors `tracker` and a library like `cortex` called [freezer](https://github.com/arqex/freezer) that provides an immutable tree data structure that is always updated from the root, even if the modification is triggered by one of the leaves, making easier to think in a reactive way.. It keeps simple how you should update your apps state and how you should
react to changes in your applications.

Making use of `tracker` we can create computations that will get invalidated when the tree has changed on the root, running again all the invalidated computations.

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

# How reactivity works

Reactivity internally works the same as Meteor:

We create a Tessel instance

```js
var state = new Tessel({
  data: {
      message: "Hello World"
  }
});
```

Then we create a computation

```js
Tessel.autorun(() => {
  console.log(state.data.message);
});

// => "Hello World"
```

At this point if the state is modified, the computation will get invalidated and will run again on the nextTick

```js
// The change will get batched
state.data.message = "Hello Again";

console.log(state.data.message); // => Hello World

// ... onNextTick when the structure runs the update, previously created computation will run again
// => Hello Again
state.data.message == "Hello Again"; // true
```

# Liscense
`Tessel` is governed under the MIT License.
