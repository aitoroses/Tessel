# Tessel

> Mix functional reactive programming with immutable cursors for handling application state. 

Inpspired by Meteors reactivity and `om`'s cursors, `Tessel` helps you writting stateless components in react providing a wrapper 
over Meteors `tracker` and a library like `cortex` called `Freezer`. It keeps simple how you should update your apps state and how you should
react to changes. In your applications.

# Installation
Tessel is available as an NPM package

`npm install tessel`

# Usage
Here is an example:

```jsx
import React from 'react';
import Tessel from 'tessel';

// State can be asynchronously requested
var AppState = new Tessel({
  options: ["Monkey", "Gorila", "Giraffe"]
});

```

We create a simple data holder

```jsx
/**
 * Main Component
 */
class MyControllerComponent extends React.Component {

  state = {
    value: null,
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
      <ListComponent listCursor={cursor.options} /> 
    )
  }
}
```

Main component passes a Tessel cursor to the list component

(Note that this is immutable) 

```jsx
/**
 * Render a list
 */
class ListComponent extends React.Component {

 static propTypes = {
    listCursor: React.PropTypes.object.isRequired
 }

  state = {
    value: null
  }
  
  /**
   * At this point we are not modifying the props
   * since we are using immutable data structure
   * it will notify for an update to the tree
   * and autorun will run again and get a new cursor.
   */
  _handleAdd() {
    this.props.listCursor.push(this.state.value);
  }
 
  render() {
    return (
      <ul>
        {this.props.list.map( el => <li>{el}</li> )}
      </ul>
      <input value={this.state.value}}>
      <button onClick={this._handleAdd.bind(this)}>Add</button>
    )
  }
}

// Render the main component
React.render(<MyControllerComponent />, document.body);
```

When we are pushing into the list, the cursor intelligently batches the update and will call autorun on the next tick.

# Liscense
`Tessel` is governed under the MIT License.
