import ReactiveVar from '../lib/reactive-var';
import Tracker from '../lib/tracker';
import Freezer from 'freezer-js';
import tesselMixinFactory from './tessel-mixin';
import tesselComponentFactory from './tessel-component';

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
    this._history = [];
    this._historyIndex = null;
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
    return tesselMixinFactory.call(this);
  }

  /**
   * Generates a component to work with ES6 classes using react-mixin
   * and the mixin of this instance in particular
   */
  get Component() {
    return tesselComponentFactory.call(this);
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

  /**
   * Sets the the history state to tessel value
   * Needs to have at least one saved value in the history
   */
  commit(historyIndex) {
    if (this._history.length) {

      var index = historyIndex != null && (historyIndex >= 0 && historyIndex < this._history.length) ?
        historyIndex : this._history.length - 1;
      // store the index
      this._historyIndex = index;
      var state = this._history[index];
      // Set the state
      this.set(state);
    }
  }

  /**
   * Saves the current state into history and commit it
   */
  save() {
    if (this._history.length > 9){
      this._history.shift();
    }
    this._history.push(this.internalData);
    // Make the commit to setup the index and the state
    this.commit();
  }

  /**
   * Restores the previous state into history
   */
  undo() {
    if (this._history.length && this._historyIndex >= 0){
      this.commit(this._historyIndex - 1);
    } else {
      return false
    }
  }
  /**
   * Restores the previously undoed state
   */
  redo() {
    if (this._history.length && this._historyIndex >= 0){
      this.commit(this._historyIndex + 1);
    } else {
      return false;
    }
  }
}

export default Tessel;
