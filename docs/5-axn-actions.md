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
