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
