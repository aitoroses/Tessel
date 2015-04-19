import ReactiveVar from '../lib/reactive-var';
import Tracker from '../lib/tracker';
import Freezer from 'freezer-js';

function createHolder(data) {

  var value = {data: data || {}};

  // Data holder instances
  var reactiveVar = new ReactiveVar();
  var store = new Freezer(value);

  // Setup in the reactive variable the correct value
  reactiveVar.set( store.get().data );

  // Setup listener for when the store updates
  store.on('update', () => {
    // This will trigger tracker autorun
    reactiveVar.set( store.get().data );
  });

  return [reactiveVar, store];
}

/**
 * Tessel abstracts tracker reactivity and uses immutable datastructures
 * pointed by cursors.
 */
class Tessel {

  static Tracker = Tracker;

  static autorun() {
    Tracker.autorun.apply(this, arguments);
  }

  static createVar(initialValue) {
    return new ReactiveVar(initialValue);
  }

  constructor(data) {
    this._internal = createHolder(data);
    this.deferredRun = Tessel.deferredRun.bind(this);
    Object.defineProperty(this, 'internalData', {
      get: () => this._internal[1].get().data,
      set: (data) => this._internal[1].get().data.reset(data)
    })
  }

  static deferredRun(...args) {
    var reactive, cb;
    if (args.length == 2) {
      reactive = args[0];
      cb = args[1];
    } else {
      reactive = this._internal[0];
      cb = args[0];
    }
    var autorun = 0;
    Tessel.autorun(() => {
      var val = reactive.get();
      if (autorun > 0) {
        cb(val);
      } else {
        autorun++;
      }
    });
  }

  set(data) {
    this.internalData = data;
  }

  get() {
    return this._internal[0].get();
  }

  dehydrate() {
    return JSON.stringify(this.internalData);
  }

  rehydrate(data) {
    this.internalData = JSON.parse(data);
  }
}

export default Tessel;
