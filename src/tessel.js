import ReactiveVar from '../lib/reactive-var';
import Tracker from '../lib/tracker';
import Freezer from 'freezer-js';

/**
 * this function creates a pair reactive-frozen
 * that will be kept in sync when the immutable tree
 * is updated
 */
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

  /**
   * Same as Trackers autorun, creates a computation
   */
  static autorun() {
    return Tracker.autorun.apply(this, arguments);
  }

  /**
   * Creates a reactive var that when calls it's get method
   * inside a computation, the computation will run again
   */
  static createVar(initialValue) {
    return new ReactiveVar(initialValue);
  }

  /**
   * This function creates a computation that will call a callback
   * when the reactive variable changes for the firstime an so on
   */
  static deferredRun(...args) {
    var reactive, cb;
    if (args.length == 2) {
      reactive = args[0];
      cb = args[1];
    } else {
      reactive = this._internal[0];
      cb = args[0];
    }
    // Once executed the first time, call the callback
    var autorun = 0;
    var computation = Tessel.autorun(() => {
      var val = reactive.get();
      if (autorun > 0) {
        cb(val);
      } else {
        autorun++;
      }
    });
    return computation;
  }

  /**
   * Stop all the current computations
   */
  static flush() {
    Object.keys(Tracker._computations).forEach(c => Tracker._computations[c].stop());
  }

  /**
   * @constructor
   * Creates a Freezer store and synchronizes it with a reactive
   * variable so it can work with tracker
   */
  constructor(data) {
    this._internal = createHolder(data);
    this.deferredRun = Tessel.deferredRun.bind(this);
    Object.defineProperty(this, 'internalData', {
      get: () => this._internal[1].get().data,
      set: (data) => this._internal[1].get().data.reset(data)
    })
  }

  /**
   * Generates a mixin to be used with react that provides
   * initial state and creates a computation to mantain the sync
   */
  get mixin() {
    var self = this;
    var mixin = {
      getInitialState() {
        return self.get();
      },
      componentDidMount() {
        // Initialize the computations
        var computations = this._computations = this._computations || [];
        var computation = Tessel.autorun(() => {
          this.setState(self.get());
        });
        computations.push(computation);
      },
      componentWillUnmount() {
        this._computations.forEach(c => c.stop());
      }
    }
    return mixin;
  }

  /**
   * Sets the store data
   */
  set(data) {
    this.internalData = data;
  }

  /**
   * Obtains the stored data but using the reactive variable
   */
  get() {
    return this._internal[0].get();
  }

  /**
   * Dehydrates the current state
   */
  dehydrate() {
    return JSON.stringify(this.internalData);
  }

  /**
   * Rehydrates the state invalidating the current computations
   * this way we can recover the aplication state.
   */
  rehydrate(data) {
    this.internalData = JSON.parse(data);
  }
}

export default Tessel;
