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
