import EventEmitter from 'eventemitter2';
import Tessel from './tessel';

class TesselStore {
  constructor(tessel) {
    this._emitter = new EventEmitter();
    this._tessel = tessel;
  }
  bindState(link) {
    var initial = this.state;

    // Setup state property
    Object.defineProperty(this, 'state', {
      get: () => {
        return this._tessel.internalData[link];
      },
      set: (val) => {
        if (!val) return;
        this._lastState = this.state;
        return this._tessel.internalData.set({[link]: val});
      }
    })

    // set initial state and last state
    this.state = initial;
    this._lastState = this.state;

    var self = this;
    // Set listener and shallowEqual of the link property
    self._tessel._internal[1].on('update' , () => {
      if (self.state !== self._lastState) {
        self._emitter.emit('update');
      }
    })
  }

  on() {
    this._emitter.on.apply(this._emitter, arguments);
  }

  /**
   * Creates an Async API for manipulating its store state
   */
  createActions(ActionsClass) {
    var self = this;
    // For a class, create all actions that are method of ActionClass
    var methods = ActionsClass.prototype;
    var methodNames = Object.getOwnPropertyNames(methods).filter( n => n != "constructor" );
    var actions = Tessel.createAsyncActions(methodNames);
    // Attach action to listener
    methodNames.forEach((a) => {
      actions[a].listen((payload) => new Promise((...args) => {
        methods[a].apply( self.state, [payload].concat(args) )
      }));
    });
    return actions;
  }

  /**
   * Return it's state exportable descriptor
   */
   getStateDescriptor() {
     var self = this;
     return {
       get state() {
         return self.state;
       },
       set state(val) {
         return self.state = val;
       }
     }
   }
}

// This function needs to be implemented by Tessel Class
export function createStore(TesselStoreExtended) {

  var tesselStoreInstance = new TesselStore(this);

  function extend(obj) {
    Object.getOwnPropertyNames(obj).forEach((k) => {
      if (k != "constructor") {
        TesselStoreExtended.prototype[k] = obj[k];
      }
    });
  }

  extend(TesselStore.prototype);
  extend(tesselStoreInstance);

  var store = new TesselStoreExtended();

  return store
};
