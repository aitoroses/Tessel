# React Mixin and Component

Each tessel instance provides a mixin and a ES6 component to implement components
that bind directly to the tessel instances state and handles the lifecycle of the computations.

Component state gets initialized to the stores value, and it automatically sets up
a computation that will run each time the state gets updated.

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
