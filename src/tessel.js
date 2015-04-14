import ReactiveVar from '../lib/reactive-var';
import Freezer from 'freezer-js';

/**
 * Tessel abstracts tracker reactivity and uses immutable datastructures
 * pointed by cursors.
 */
class Tessel {

  constructor() {

    // Data holder instances
    var reactiveVar = this._reactiveVar = new ReactiveVar();
    var store = this._store = new Freezer({});

    // Setup in the reactive variable the correct value
    reactiveVar.set( store.get() );

    // Setup listener for when the store updates
    store.on('update', () => {
        // This will trigger tracker autorun
        reactiveVar.set( store.get() );
    });
  }

  set(data) {
    this._store.set(data);
  }

  get(key) {
    return this._reactiveVar.get();
  }
}

export default Tessel;
