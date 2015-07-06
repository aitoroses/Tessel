[![Build Status](https://travis-ci.org/aitoroses/Tessel.svg?branch=master)](https://travis-ci.org/aitoroses/Tessel)

# Tessel

> Mix functional reactive programming with immutable cursors for handling application state.

> Implements a history API

> Implements Flux based architecture

Inpspired by Meteors reactivity and `om`'s cursors, `Tessel` helps you writting stateless components in react providing a wrapper
over Meteors `tracker` and a library like `cortex` called [freezer](https://github.com/arqex/freezer) that provides an immutable tree data structure that is always updated from the root, even if the modification is triggered by one of the leaves, making easier to think in a reactive way.. It keeps simple how you should update your apps state and how you should
react to changes in your applications.

Making use of `tracker` we can create computations that will get invalidated when the tree has changed on the root. Invalidated computations will run again reactively.

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

# Documentation

See the 'docs' folder.

# Liscense
`Tessel` is governed under the MIT License.
