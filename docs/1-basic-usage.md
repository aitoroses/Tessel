# Basic Usage
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
