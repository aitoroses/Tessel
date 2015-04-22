(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["Tessel"] = factory(require("react"));
	else
		root["Tessel"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _ReactiveVar = __webpack_require__(2);

	var _ReactiveVar2 = _interopRequireWildcard(_ReactiveVar);

	var _Tracker = __webpack_require__(3);

	var _Tracker2 = _interopRequireWildcard(_Tracker);

	var _Freezer = __webpack_require__(8);

	var _Freezer2 = _interopRequireWildcard(_Freezer);

	var _tesselMixinFactory = __webpack_require__(4);

	var _tesselMixinFactory2 = _interopRequireWildcard(_tesselMixinFactory);

	var _tesselComponentFactory = __webpack_require__(5);

	var _tesselComponentFactory2 = _interopRequireWildcard(_tesselComponentFactory);

	var _createActions$createAsyncActions = __webpack_require__(6);

	/**
	 * this function creates a pair reactive-frozen
	 * that will be kept in sync when the immutable tree
	 * is updated
	 */
	function createHolder(data) {

	  var value = { data: data || {} };

	  // Data holder instances
	  var reactiveVar = new _ReactiveVar2['default']();
	  var store = new _Freezer2['default'](value);

	  // Setup in the reactive variable the correct value
	  reactiveVar.set(store.get().data);

	  // Setup listener for when the store updates
	  store.on('update', function () {
	    // This will trigger tracker autorun
	    reactiveVar.set(store.get().data);
	  });

	  return [reactiveVar, store];
	}

	/**
	 * Tessel abstracts tracker reactivity and uses immutable datastructures
	 * pointed by cursors.
	 */

	var Tessel = (function () {

	  /**
	   * @constructor
	   * Creates a Freezer store and synchronizes it with a reactive
	   * variable so it can work with tracker
	   */

	  function Tessel(data) {
	    var _this = this;

	    _classCallCheck(this, Tessel);

	    this._internal = createHolder(data);
	    this.deferredRun = Tessel.deferredRun.bind(this);
	    this._history = [];
	    this._historyIndex = null;
	    Object.defineProperty(this, 'internalData', {
	      get: function get() {
	        return _this._internal[1].get().data;
	      },
	      set: function set(data) {
	        return _this._internal[1].get().data.reset(data);
	      }
	    });
	  }

	  _createClass(Tessel, [{
	    key: 'mixin',

	    /**
	     * Generates a mixin to be used with react that provides
	     * initial state and creates a computation to mantain the sync
	     */
	    get: function () {
	      return _tesselMixinFactory2['default'].call(this);
	    }
	  }, {
	    key: 'Component',

	    /**
	     * Generates a component to work with ES6 classes using react-mixin
	     * and the mixin of this instance in particular
	     */
	    get: function () {
	      return _tesselComponentFactory2['default'].call(this);
	    }
	  }, {
	    key: 'set',

	    /**
	     * Sets the store data
	     */
	    value: function set(data) {
	      this.internalData = data;
	    }
	  }, {
	    key: 'get',

	    /**
	     * Obtains the stored data but using the reactive variable
	     */
	    value: function get() {
	      return this._internal[0].get();
	    }
	  }, {
	    key: 'dehydrate',

	    /**
	     * Dehydrates the current state
	     */
	    value: function dehydrate() {
	      return JSON.stringify(this.internalData);
	    }
	  }, {
	    key: 'rehydrate',

	    /**
	     * Rehydrates the state invalidating the current computations
	     * this way we can recover the aplication state.
	     */
	    value: function rehydrate(data) {
	      this.internalData = JSON.parse(data);
	    }
	  }, {
	    key: 'commit',

	    /**
	     * Sets the the history state to tessel value
	     * Needs to have at least one saved value in the history
	     */
	    value: function commit(historyIndex) {
	      if (this._history.length) {

	        var index = historyIndex != null && (historyIndex >= 0 && historyIndex < this._history.length) ? historyIndex : this._history.length - 1;
	        // store the index
	        this._historyIndex = index;
	        var state = this._history[index];
	        // Set the state
	        this.set(state);
	      }
	    }
	  }, {
	    key: 'save',

	    /**
	     * Saves the current state into history and commit it
	     */
	    value: function save() {
	      if (this._history.length > 9) {
	        this._history.shift();
	      }
	      this._history.push(this.internalData);
	      // Make the commit to setup the index and the state
	      this.commit();
	    }
	  }, {
	    key: 'undo',

	    /**
	     * Restores the previous state into history
	     */
	    value: function undo() {
	      if (this._history.length && this._historyIndex >= 0) {
	        this.commit(this._historyIndex - 1);
	      } else {
	        return false;
	      }
	    }
	  }, {
	    key: 'redo',

	    /**
	     * Restores the previously undoed state
	     */
	    value: function redo() {
	      if (this._history.length && this._historyIndex >= 0) {
	        this.commit(this._historyIndex + 1);
	      } else {
	        return false;
	      }
	    }
	  }], [{
	    key: 'createActions',
	    value: _createActions$createAsyncActions.createActions,
	    enumerable: true
	  }, {
	    key: 'createAsyncActions',
	    value: _createActions$createAsyncActions.createAsyncActions,
	    enumerable: true
	  }, {
	    key: 'Tracker',

	    /**
	     * Reference to tracker
	     */
	    value: _Tracker2['default'],
	    enumerable: true
	  }, {
	    key: 'autorun',

	    /**
	     * Same as Trackers autorun, creates a computation
	     */
	    value: function autorun() {
	      return _Tracker2['default'].autorun.apply(this, arguments);
	    }
	  }, {
	    key: 'createVar',

	    /**
	     * Creates a reactive var that when calls it's get method
	     * inside a computation, the computation will run again
	     */
	    value: function createVar(initialValue) {
	      return new _ReactiveVar2['default'](initialValue);
	    }
	  }, {
	    key: 'deferredRun',

	    /**
	     * This function creates a computation that will call a callback
	     * when the reactive variable changes for the firstime an so on
	     */
	    value: function deferredRun() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

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
	      var computation = Tessel.autorun(function () {
	        var val = reactive.get();
	        if (autorun > 0) {
	          cb(val);
	        } else {
	          autorun++;
	        }
	      });
	      return computation;
	    }
	  }, {
	    key: 'flush',

	    /**
	     * Stop all the current computations
	     */
	    value: function flush() {
	      Object.keys(_Tracker2['default']._computations).forEach(function (c) {
	        return _Tracker2['default']._computations[c].stop();
	      });
	    }
	  }]);

	  return Tessel;
	})();

	exports['default'] = Tessel;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _Tracker = __webpack_require__(3);

	var _Tracker2 = _interopRequireWildcard(_Tracker);

	/*
	 * ## [new] ReactiveVar(initialValue, [equalsFunc])
	 *
	 * A ReactiveVar holds a single value that can be get and set,
	 * such that calling `set` will invalidate any Computations that
	 * called `get`, according to the usual contract for reactive
	 * data sources.
	 *
	 * A ReactiveVar is much like a Session variable -- compare `foo.get()`
	 * to `Session.get("foo")` -- but it doesn't have a global name and isn't
	 * automatically migrated across hot code pushes.  Also, while Session
	 * variables can only hold JSON or EJSON, ReactiveVars can hold any value.
	 *
	 * An important property of ReactiveVars, which is sometimes the reason
	 * to use one, is that setting the value to the same value as before has
	 * no effect, meaning ReactiveVars can be used to absorb extra
	 * invalidations that wouldn't serve a purpose.  However, by default,
	 * ReactiveVars are extremely conservative about what changes they
	 * absorb.  Calling `set` with an object argument will *always* trigger
	 * invalidations, because even if the new value is `===` the old value,
	 * the object may have been mutated.  You can change the default behavior
	 * by passing a function of two arguments, `oldValue` and `newValue`,
	 * to the constructor as `equalsFunc`.
	 *
	 * This class is extremely basic right now, but the idea is to evolve
	 * it into the ReactiveVar of Geoff's Lickable Forms proposal.
	 */

	var ReactiveVar;

	/**
	 * @class
	 * @instanceName reactiveVar
	 * @summary Constructor for a ReactiveVar, which represents a single reactive variable.
	 * @locus Client
	 * @param {Any} initialValue The initial value to set.  `equalsFunc` is ignored when setting the initial value.
	 * @param {Function} [equalsFunc] Optional.  A function of two arguments, called on the old value and the new value whenever the ReactiveVar is set.  If it returns true, no set is performed.  If omitted, the default `equalsFunc` returns true if its arguments are `===` and are of type number, boolean, string, undefined, or null.
	 */
	ReactiveVar = function (initialValue, equalsFunc) {
	  if (!(this instanceof ReactiveVar))
	    // called without `new`
	    return new ReactiveVar(initialValue, equalsFunc);

	  this.curValue = initialValue;
	  this.equalsFunc = equalsFunc;
	  this.dep = new _Tracker2['default'].Dependency();
	};

	ReactiveVar._isEqual = function (oldValue, newValue) {
	  var a = oldValue,
	      b = newValue;
	  // Two values are "equal" here if they are `===` and are
	  // number, boolean, string, undefined, or null.
	  if (a !== b) return false;else return !a || typeof a === 'number' || typeof a === 'boolean' || typeof a === 'string';
	};

	/**
	 * @summary Returns the current value of the ReactiveVar, establishing a reactive dependency.
	 * @locus Client
	 */
	ReactiveVar.prototype.get = function () {
	  if (_Tracker2['default'].active) this.dep.depend();

	  return this.curValue;
	};

	/**
	 * @summary Sets the current value of the ReactiveVar, invalidating the Computations that called `get` if `newValue` is different from the old value.
	 * @locus Client
	 * @param {Any} newValue
	 */
	ReactiveVar.prototype.set = function (newValue) {
	  var oldValue = this.curValue;

	  if ((this.equalsFunc || ReactiveVar._isEqual)(oldValue, newValue))
	    // value is same as last time
	    return;

	  this.curValue = newValue;
	  this.dep.changed();
	};

	ReactiveVar.prototype.toString = function () {
	  return 'ReactiveVar{' + this.get() + '}';
	};

	ReactiveVar.prototype._numListeners = function () {
	  // Tests want to know.
	  // Accesses a private field of Tracker.Dependency.
	  var count = 0;
	  for (var id in this.dep._dependentsById) count++;
	  return count;
	};

	exports['default'] = ReactiveVar;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var Tracker;

	/////////////////////////////////////////////////////
	// Package docs at http://docs.meteor.com/#tracker //
	/////////////////////////////////////////////////////

	/**
	 * @namespace Tracker
	 * @summary The namespace for Tracker-related methods.
	 */
	Tracker = {};

	// http://docs.meteor.com/#tracker_active

	/**
	 * @summary True if there is a current computation, meaning that dependencies on reactive data sources will be tracked and potentially cause the current computation to be rerun.
	 * @locus Client
	 * @type {Boolean}
	 */
	Tracker.active = false;

	// http://docs.meteor.com/#tracker_currentcomputation

	/**
	 * @summary The current computation, or `null` if there isn't one.  The current computation is the [`Tracker.Computation`](#tracker_computation) object created by the innermost active call to `Tracker.autorun`, and it's the computation that gains dependencies when reactive data sources are accessed.
	 * @locus Client
	 * @type {Tracker.Computation}
	 */
	Tracker.currentComputation = null;

	// References to all computations created within the Tracker by id.
	// Keeping these references on an underscore property gives more control to
	// tooling and packages extending Tracker without increasing the API surface.
	// These can used to monkey-patch computations, their functions, use
	// computation ids for tracking, etc.
	Tracker._computations = {};

	var setCurrentComputation = function setCurrentComputation(c) {
	  Tracker.currentComputation = c;
	  Tracker.active = !!c;
	};

	var _debugFunc = function _debugFunc() {
	  // We want this code to work without Meteor, and also without
	  // "console" (which is technically non-standard and may be missing
	  // on some browser we come across, like it was on IE 7).
	  //
	  // Lazy evaluation because `Meteor` does not exist right away.(??)
	  return typeof Meteor !== "undefined" ? Meteor._debug : typeof console !== "undefined" && console.error ? function () {
	    console.error.apply(console, arguments);
	  } : function () {};
	};

	var _maybeSupressMoreLogs = function _maybeSupressMoreLogs(messagesLength) {
	  // Sometimes when running tests, we intentionally supress logs on expected
	  // printed errors. Since the current implementation of _throwOrLog can log
	  // multiple separate log messages, supress all of them if at least one supress
	  // is expected as we still want them to count as one.
	  if (typeof Meteor !== "undefined") {
	    if (Meteor._supressed_log_expected()) {
	      Meteor._suppress_log(messagesLength - 1);
	    }
	  }
	};

	var _throwOrLog = function _throwOrLog(from, e) {
	  if (throwFirstError) {
	    throw e;
	  } else {
	    var printArgs = ["Exception from Tracker " + from + " function:"];
	    if (e.stack && e.message && e.name) {
	      var idx = e.stack.indexOf(e.message);
	      if (idx < 0 || idx > e.name.length + 2) {
	        // check for "Error: "
	        // message is not part of the stack
	        var message = e.name + ": " + e.message;
	        printArgs.push(message);
	      }
	    }
	    printArgs.push(e.stack);
	    _maybeSupressMoreLogs(printArgs.length);

	    for (var i = 0; i < printArgs.length; i++) {
	      _debugFunc()(printArgs[i]);
	    }
	  }
	};

	// Takes a function `f`, and wraps it in a `Meteor._noYieldsAllowed`
	// block if we are running on the server. On the client, returns the
	// original function (since `Meteor._noYieldsAllowed` is a
	// no-op). This has the benefit of not adding an unnecessary stack
	// frame on the client.
	var withNoYieldsAllowed = function withNoYieldsAllowed(f) {
	  if (typeof Meteor === "undefined" || Meteor.isClient) {
	    return f;
	  } else {
	    return function () {
	      var args = arguments;
	      Meteor._noYieldsAllowed(function () {
	        f.apply(null, args);
	      });
	    };
	  }
	};

	var nextId = 1;
	// computations whose callbacks we should call at flush time
	var pendingComputations = [];
	// `true` if a Tracker.flush is scheduled, or if we are in Tracker.flush now
	var willFlush = false;
	// `true` if we are in Tracker.flush now
	var inFlush = false;
	// `true` if we are computing a computation now, either first time
	// or recompute.  This matches Tracker.active unless we are inside
	// Tracker.nonreactive, which nullfies currentComputation even though
	// an enclosing computation may still be running.
	var inCompute = false;
	// `true` if the `_throwFirstError` option was passed in to the call
	// to Tracker.flush that we are in. When set, throw rather than log the
	// first error encountered while flushing. Before throwing the error,
	// finish flushing (from a finally block), logging any subsequent
	// errors.
	var throwFirstError = false;

	var afterFlushCallbacks = [];

	var requireFlush = function requireFlush() {
	  if (!willFlush) {
	    // We want this code to work without Meteor, see debugFunc above
	    if (typeof Meteor !== "undefined") Meteor._setImmediate(Tracker._runFlush);else setTimeout(Tracker._runFlush, 0);
	    willFlush = true;
	  }
	};

	// Tracker.Computation constructor is visible but private
	// (throws an error if you try to call it)
	var constructingComputation = false;

	//
	// http://docs.meteor.com/#tracker_computation

	/**
	 * @summary A Computation object represents code that is repeatedly rerun
	 * in response to
	 * reactive data changes. Computations don't have return values; they just
	 * perform actions, such as rerendering a template on the screen. Computations
	 * are created using Tracker.autorun. Use stop to prevent further rerunning of a
	 * computation.
	 * @instancename computation
	 */
	Tracker.Computation = function (f, parent, onError) {
	  if (!constructingComputation) throw new Error("Tracker.Computation constructor is private; use Tracker.autorun");
	  constructingComputation = false;

	  var self = this;

	  // http://docs.meteor.com/#computation_stopped

	  /**
	   * @summary True if this computation has been stopped.
	   * @locus Client
	   * @memberOf Tracker.Computation
	   * @instance
	   * @name  stopped
	   */
	  self.stopped = false;

	  // http://docs.meteor.com/#computation_invalidated

	  /**
	   * @summary True if this computation has been invalidated (and not yet rerun), or if it has been stopped.
	   * @locus Client
	   * @memberOf Tracker.Computation
	   * @instance
	   * @name  invalidated
	   * @type {Boolean}
	   */
	  self.invalidated = false;

	  // http://docs.meteor.com/#computation_firstrun

	  /**
	   * @summary True during the initial run of the computation at the time `Tracker.autorun` is called, and false on subsequent reruns and at other times.
	   * @locus Client
	   * @memberOf Tracker.Computation
	   * @instance
	   * @name  firstRun
	   * @type {Boolean}
	   */
	  self.firstRun = true;

	  self._id = nextId++;
	  self._onInvalidateCallbacks = [];
	  // the plan is at some point to use the parent relation
	  // to constrain the order that computations are processed
	  self._parent = parent;
	  self._func = f;
	  self._onError = onError;
	  self._recomputing = false;

	  // Register the computation within the global Tracker.
	  Tracker._computations[self._id] = self;

	  var errored = true;
	  try {
	    self._compute();
	    errored = false;
	  } finally {
	    self.firstRun = false;
	    if (errored) self.stop();
	  }
	};

	// http://docs.meteor.com/#computation_oninvalidate

	/**
	 * @summary Registers `callback` to run when this computation is next invalidated, or runs it immediately if the computation is already invalidated.  The callback is run exactly once and not upon future invalidations unless `onInvalidate` is called again after the computation becomes valid again.
	 * @locus Client
	 * @param {Function} callback Function to be called on invalidation. Receives one argument, the computation that was invalidated.
	 */
	Tracker.Computation.prototype.onInvalidate = function (f) {
	  var self = this;

	  if (typeof f !== "function") throw new Error("onInvalidate requires a function");

	  if (self.invalidated) {
	    Tracker.nonreactive(function () {
	      withNoYieldsAllowed(f)(self);
	    });
	  } else {
	    self._onInvalidateCallbacks.push(f);
	  }
	};

	// http://docs.meteor.com/#computation_invalidate

	/**
	 * @summary Invalidates this computation so that it will be rerun.
	 * @locus Client
	 */
	Tracker.Computation.prototype.invalidate = function () {
	  var self = this;
	  if (!self.invalidated) {
	    // if we're currently in _recompute(), don't enqueue
	    // ourselves, since we'll rerun immediately anyway.
	    if (!self._recomputing && !self.stopped) {
	      requireFlush();
	      pendingComputations.push(this);
	    }

	    self.invalidated = true;

	    // callbacks can't add callbacks, because
	    // self.invalidated === true.
	    for (var i = 0, f; f = self._onInvalidateCallbacks[i]; i++) {
	      Tracker.nonreactive(function () {
	        withNoYieldsAllowed(f)(self);
	      });
	    }
	    self._onInvalidateCallbacks = [];
	  }
	};

	// http://docs.meteor.com/#computation_stop

	/**
	 * @summary Prevents this computation from rerunning.
	 * @locus Client
	 */
	Tracker.Computation.prototype.stop = function () {
	  if (!this.stopped) {
	    this.stopped = true;
	    this.invalidate();
	    // Unregister from global Tracker.
	    delete Tracker._computations[this._id];
	  }
	};

	Tracker.Computation.prototype._compute = function () {
	  var self = this;
	  self.invalidated = false;

	  var previous = Tracker.currentComputation;
	  setCurrentComputation(self);
	  var previousInCompute = inCompute;
	  inCompute = true;
	  try {
	    withNoYieldsAllowed(self._func)(self);
	  } finally {
	    setCurrentComputation(previous);
	    inCompute = previousInCompute;
	  }
	};

	Tracker.Computation.prototype._needsRecompute = function () {
	  var self = this;
	  return self.invalidated && !self.stopped;
	};

	Tracker.Computation.prototype._recompute = function () {
	  var self = this;

	  self._recomputing = true;
	  try {
	    if (self._needsRecompute()) {
	      try {
	        self._compute();
	      } catch (e) {
	        if (self._onError) {
	          self._onError(e);
	        } else {
	          _throwOrLog("recompute", e);
	        }
	      }
	    }
	  } finally {
	    self._recomputing = false;
	  }
	};

	//
	// http://docs.meteor.com/#tracker_dependency

	/**
	 * @summary A Dependency represents an atomic unit of reactive data that a
	 * computation might depend on. Reactive data sources such as Session or
	 * Minimongo internally create different Dependency objects for different
	 * pieces of data, each of which may be depended on by multiple computations.
	 * When the data changes, the computations are invalidated.
	 * @class
	 * @instanceName dependency
	 */
	Tracker.Dependency = function () {
	  this._dependentsById = {};
	};

	// http://docs.meteor.com/#dependency_depend
	//
	// Adds `computation` to this set if it is not already
	// present.  Returns true if `computation` is a new member of the set.
	// If no argument, defaults to currentComputation, or does nothing
	// if there is no currentComputation.

	/**
	 * @summary Declares that the current computation (or `fromComputation` if given) depends on `dependency`.  The computation will be invalidated the next time `dependency` changes.
	If there is no current computation and `depend()` is called with no arguments, it does nothing and returns false.
	Returns true if the computation is a new dependent of `dependency` rather than an existing one.
	 * @locus Client
	 * @param {Tracker.Computation} [fromComputation] An optional computation declared to depend on `dependency` instead of the current computation.
	 * @returns {Boolean}
	 */
	Tracker.Dependency.prototype.depend = function (computation) {
	  if (!computation) {
	    if (!Tracker.active) return false;

	    computation = Tracker.currentComputation;
	  }
	  var self = this;
	  var id = computation._id;
	  if (!(id in self._dependentsById)) {
	    self._dependentsById[id] = computation;
	    computation.onInvalidate(function () {
	      delete self._dependentsById[id];
	    });
	    return true;
	  }
	  return false;
	};

	// http://docs.meteor.com/#dependency_changed

	/**
	 * @summary Invalidate all dependent computations immediately and remove them as dependents.
	 * @locus Client
	 */
	Tracker.Dependency.prototype.changed = function () {
	  var self = this;
	  for (var id in self._dependentsById) self._dependentsById[id].invalidate();
	};

	// http://docs.meteor.com/#dependency_hasdependents

	/**
	 * @summary True if this Dependency has one or more dependent Computations, which would be invalidated if this Dependency were to change.
	 * @locus Client
	 * @returns {Boolean}
	 */
	Tracker.Dependency.prototype.hasDependents = function () {
	  var self = this;
	  for (var id in self._dependentsById) return true;
	  return false;
	};

	// http://docs.meteor.com/#tracker_flush

	/**
	 * @summary Process all reactive updates immediately and ensure that all invalidated computations are rerun.
	 * @locus Client
	 */
	Tracker.flush = function (options) {
	  Tracker._runFlush({ finishSynchronously: true,
	    throwFirstError: options && options._throwFirstError });
	};

	// Run all pending computations and afterFlush callbacks.  If we were not called
	// directly via Tracker.flush, this may return before they're all done to allow
	// the event loop to run a little before continuing.
	Tracker._runFlush = function (options) {
	  // XXX What part of the comment below is still true? (We no longer
	  // have Spark)
	  //
	  // Nested flush could plausibly happen if, say, a flush causes
	  // DOM mutation, which causes a "blur" event, which runs an
	  // app event handler that calls Tracker.flush.  At the moment
	  // Spark blocks event handlers during DOM mutation anyway,
	  // because the LiveRange tree isn't valid.  And we don't have
	  // any useful notion of a nested flush.
	  //
	  // https://app.asana.com/0/159908330244/385138233856
	  if (inFlush) throw new Error("Can't call Tracker.flush while flushing");

	  if (inCompute) throw new Error("Can't flush inside Tracker.autorun");

	  options = options || {};

	  inFlush = true;
	  willFlush = true;
	  throwFirstError = !!options.throwFirstError;

	  var recomputedCount = 0;
	  var finishedTry = false;
	  try {
	    while (pendingComputations.length || afterFlushCallbacks.length) {

	      // recompute all pending computations
	      while (pendingComputations.length) {
	        var comp = pendingComputations.shift();
	        comp._recompute();
	        if (comp._needsRecompute()) {
	          pendingComputations.unshift(comp);
	        }

	        if (!options.finishSynchronously && ++recomputedCount > 1000) {
	          finishedTry = true;
	          return;
	        }
	      }

	      if (afterFlushCallbacks.length) {
	        // call one afterFlush callback, which may
	        // invalidate more computations
	        var func = afterFlushCallbacks.shift();
	        try {
	          func();
	        } catch (e) {
	          _throwOrLog("afterFlush", e);
	        }
	      }
	    }
	    finishedTry = true;
	  } finally {
	    if (!finishedTry) {
	      // we're erroring due to throwFirstError being true.
	      inFlush = false; // needed before calling `Tracker.flush()` again
	      // finish flushing
	      Tracker._runFlush({
	        finishSynchronously: options.finishSynchronously,
	        throwFirstError: false
	      });
	    }
	    willFlush = false;
	    inFlush = false;
	    if (pendingComputations.length || afterFlushCallbacks.length) {
	      // We're yielding because we ran a bunch of computations and we aren't
	      // required to finish synchronously, so we'd like to give the event loop a
	      // chance. We should flush again soon.
	      if (options.finishSynchronously) {
	        throw new Error("still have more to do?"); // shouldn't happen
	      }
	      setTimeout(requireFlush, 10);
	    }
	  }
	};

	// http://docs.meteor.com/#tracker_autorun
	//
	// Run f(). Record its dependencies. Rerun it whenever the
	// dependencies change.
	//
	// Returns a new Computation, which is also passed to f.
	//
	// Links the computation to the current computation
	// so that it is stopped if the current computation is invalidated.

	/**
	 * @callback Tracker.ComputationFunction
	 * @param {Tracker.Computation}
	 */
	/**
	 * @summary Run a function now and rerun it later whenever its dependencies
	 * change. Returns a Computation object that can be used to stop or observe the
	 * rerunning.
	 * @locus Client
	 * @param {Tracker.ComputationFunction} runFunc The function to run. It receives
	 * one argument: the Computation object that will be returned.
	 * @param {Object} [options]
	 * @param {Function} options.onError Optional. The function to run when an error
	 * happens in the Computation. The only argument it recieves is the Error
	 * thrown. Defaults to the error being logged to the console.
	 * @returns {Tracker.Computation}
	 */
	Tracker.autorun = function (f, options) {
	  if (typeof f !== "function") throw new Error("Tracker.autorun requires a function argument");

	  options = options || {};

	  constructingComputation = true;
	  var c = new Tracker.Computation(f, Tracker.currentComputation, options.onError);

	  if (Tracker.active) Tracker.onInvalidate(function () {
	    c.stop();
	  });

	  return c;
	};

	// http://docs.meteor.com/#tracker_nonreactive
	//
	// Run `f` with no current computation, returning the return value
	// of `f`.  Used to turn off reactivity for the duration of `f`,
	// so that reactive data sources accessed by `f` will not result in any
	// computations being invalidated.

	/**
	 * @summary Run a function without tracking dependencies.
	 * @locus Client
	 * @param {Function} func A function to call immediately.
	 */
	Tracker.nonreactive = function (f) {
	  var previous = Tracker.currentComputation;
	  setCurrentComputation(null);
	  try {
	    return f();
	  } finally {
	    setCurrentComputation(previous);
	  }
	};

	// http://docs.meteor.com/#tracker_oninvalidate

	/**
	 * @summary Registers a new [`onInvalidate`](#computation_oninvalidate) callback on the current computation (which must exist), to be called immediately when the current computation is invalidated or stopped.
	 * @locus Client
	 * @param {Function} callback A callback function that will be invoked as `func(c)`, where `c` is the computation on which the callback is registered.
	 */
	Tracker.onInvalidate = function (f) {
	  if (!Tracker.active) throw new Error("Tracker.onInvalidate requires a currentComputation");

	  Tracker.currentComputation.onInvalidate(f);
	};

	// http://docs.meteor.com/#tracker_afterflush

	/**
	 * @summary Schedules a function to be called during the next flush, or later in the current flush if one is in progress, after all invalidated computations have been rerun.  The function will be run once and not on subsequent flushes unless `afterFlush` is called again.
	 * @locus Client
	 * @param {Function} callback A function to call at flush time.
	 */
	Tracker.afterFlush = function (f) {
	  afterFlushCallbacks.push(f);
	  requireFlush();
	};

	exports["default"] = Tracker;
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _Tessel = __webpack_require__(1);

	var _Tessel2 = _interopRequireWildcard(_Tessel);

	module.exports = function tesselMixi() {
	  var self = this;
	  var mixin = {
	    getInitialState: function getInitialState() {
	      return self.get();
	    },
	    componentDidMount: function componentDidMount() {
	      var _this = this;

	      // Initialize the computations
	      var computations = this._computations = this._computations || [];
	      var computation = _Tessel2['default'].autorun(function () {
	        _this.setState(self.get());
	      });
	      computations.push(computation);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      this._computations.forEach(function (c) {
	        return c.stop();
	      });
	    }
	  };
	  return mixin;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _React = __webpack_require__(7);

	var _React2 = _interopRequireWildcard(_React);

	var _Mixin = __webpack_require__(9);

	module.exports = function tesselComponentFactory() {

	  var componentMixin = this.mixin;

	  var TesselComponent = (function (_React$Component) {
	    function TesselComponent() {
	      _classCallCheck(this, _TesselComponent);

	      if (_React$Component != null) {
	        _React$Component.apply(this, arguments);
	      }
	    }

	    _inherits(TesselComponent, _React$Component);

	    var _TesselComponent = TesselComponent;
	    TesselComponent = _Mixin.decorate(componentMixin)(TesselComponent) || TesselComponent;
	    return TesselComponent;
	  })(_React2['default'].Component);

	  return TesselComponent;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.createActions = createActions;
	exports.createAsyncActions = createAsyncActions;
	var axn = __webpack_require__(10);

	function createActions(specs) {
	  var obj = {};
	  if (Array.isArray(specs)) {
	    specs.forEach(function (name) {
	      obj[name] = axn();
	    });
	  } else {
	    Object.keys(specs).forEach(function (name) {
	      obj[name] = axn(specs[name]);
	    });
	  }
	  return obj;
	}

	function createAsyncActions(specs) {
	  var obj = {};
	  if (Array.isArray(specs)) {
	    specs.forEach(function (name) {
	      obj[name] = axn.async();
	    });
	  } else {
	    Object.keys(specs).forEach(function (name) {
	      obj[name] = axn.async(specs[name]);
	    });
	  }
	  return obj;
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Freezer = __webpack_require__(11);
	module.exports = Freezer;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var mixin = __webpack_require__(12);
	var assign = __webpack_require__(17);

	var mixinProto = mixin({
	  // lifecycle stuff is as you'd expect
	  componentDidMount: mixin.MANY,
	  componentWillMount: mixin.MANY,
	  componentWillReceiveProps: mixin.MANY,
	  shouldComponentUpdate: mixin.ONCE,
	  componentWillUpdate: mixin.MANY,
	  componentDidUpdate: mixin.MANY,
	  componentWillUnmount: mixin.MANY,
	  getChildContext: mixin.MANY_MERGED
	});

	function setDefaultProps(reactMixin) {
	  var getDefaultProps = reactMixin.getDefaultProps;

	  if(getDefaultProps) {
	    reactMixin.defaultProps = getDefaultProps();

	    delete reactMixin.getDefaultProps;
	  }
	}

	function setInitialState(reactMixin) {
	  var getInitialState = reactMixin.getInitialState;
	  var componentWillMount = reactMixin.componentWillMount;

	  function applyInitialState(instance){
	      var state = instance.state || {};
	      assign(state, getInitialState.call(instance));
	      instance.state = state;
	  }

	  if(getInitialState) {
	    if(!componentWillMount) {
	      reactMixin.componentWillMount = function() {
	          applyInitialState(this);
	      };
	    }
	    else {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	        componentWillMount.call(this);
	      };
	    }

	    delete reactMixin.getInitialState;
	  }
	}

	function mixinClass(reactClass, reactMixin) {
	  setDefaultProps(reactMixin);
	  setInitialState(reactMixin);

	  var prototypeMethods = {};
	  var staticProps = {};

	  Object.keys(reactMixin).forEach(function(key) {
	    if(typeof reactMixin[key] === 'function') {
	      prototypeMethods[key] = reactMixin[key];
	    }
	    else {
	      staticProps[key] = reactMixin[key];
	    }
	  });

	  mixinProto(reactClass.prototype, prototypeMethods);

	  mixin({
	    childContextTypes: mixin.MANY_MERGED_LOOSE,
	    contextTypes: mixin.MANY_MERGED_LOOSE,
	    propTypes: mixin.MANY_MERGED_LOOSE,
	    defaultProps: mixin.MANY_MERGED_LOOSE
	  })(reactClass, staticProps);
	}

	module.exports = (function () {
	  reactMixin = mixinProto;

	  reactMixin.onClass = function(reactClass, mixin) {
	    mixinClass(reactClass, mixin)
	  };

	  reactMixin.decorate = function(mixin) {
	    return function(reactClass) {
	      return reactMixin.onClass(reactClass, mixin);
	    };
	  }

	  return reactMixin;
	})();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint es3: true */
	/*global module, Promise */
	'use strict';
	function createAction(spec, base) {
	  function action(data) {
	    return action.emit(data);
	  }
	  action._listeners = [];
	  if (spec) ext(action, spec);
	  return ext(action, base);
	}

	function axn(spec) {
	  return createAction(spec, axn.methods);
	}

	function aaxn(spec) {
	  return ext(createAction(spec, aaxn.methods), axn.methods);
	}

	function ext(obj, src) {
	  for (var key in src) {
	    if (src.hasOwnProperty(key)) {
	      if (obj.hasOwnProperty(key)) continue;
	      obj[key] = src[key];
	    }
	  }
	  return obj;
	}

	axn.methods = {
	  _cb: function (fn, ctx) {
	    return function (data, result) {
	      return fn.call(ctx, data, result);
	    };
	  },
	  _listen: function (fn, ctx, once) {
	    var cb = this._cb(fn, ctx);
	    this._listeners.push(cb);
	    cb.ctx = ctx;
	    cb.fn = fn;
	    cb.once = once;
	    var self = this;
	    return function () {
	      var i = self._listeners.indexOf(cb);
	      if (i === -1) return false;
	      self._listeners.splice(i, 1);
	      return true;
	    };
	  },
	  listenOnce: function (fn, ctx) {
	    return this._listen(fn, ctx, true);
	  },
	  listen: function (fn, ctx) {
	    return this._listen(fn, ctx, false);
	  },
	  unlisten: function (fn, ctx) {
	    for (var i = 0; i < this._listeners.length; i++) {
	      var listener = this._listeners[i];
	      if (listener.fn === fn && listener.ctx === ctx) {
	        this._listeners.splice(i, 1);
	        return true;
	      }
	    }
	    return false;
	  },
	  shouldEmit: function (/* data */) {
	    return true;
	  },
	  beforeEmit: function (data) {
	    return data;
	  },
	  _beforeEmit: function (data) {
	    return data;
	  },
	  _afterEmit: function (result/*, data */) {
	    return result;
	  },
	  emit: function (data) {
	    data = this.beforeEmit(data);
	    var initial = this._beforeEmit(data);
	    var result = initial;
	    if (!this.shouldEmit(data)) return result;
	    for (var i = 0; i < this._listeners.length; i++) {
	      var listener = this._listeners[i];
	      result = listener(data, result, initial);
	      if (listener.once) {
	        this._listeners.splice(i, 1);
	        i -= 1;
	      }
	    }
	    result = this._afterEmit(result, initial);
	    return result;
	  }
	};

	aaxn.methods = {
	  _cb: function (fn, ctx) {
	    return function (data, p, p0) {
	      return p.then(function (result) {
	        if (p0._cancelled) return Promise.reject(new Error('rejected'));
	        return fn.call(ctx, data, result);
	      });
	    };
	  },
	  _beforeEmit: function (data) {
	    return ext(Promise.resolve(data), {
	      _cancelled: false
	    });
	  },
	  _afterEmit: function (p, p0) {
	    return ext(p.then(function (value) {
	      if (p0._cancelled) return Promise.reject(new Error('rejected'));
	      return value;
	    }), {
	      cancel: function () {
	        p0._cancelled = true;
	      },
	      cancelled: function () {
	        return p0._cancelled;
	      }
	    });
	  }
	};

	axn.async = aaxn;

	module.exports = axn;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__( 13 ),
		Emitter = __webpack_require__( 14 ),
		Mixins = __webpack_require__( 15 ),
		Frozen = __webpack_require__( 16 )
	;

	//#build
	var Freezer = function( initialValue, mutable ) {
		var me = this;

		// Immutable data
		var frozen;

		var notify = function notify( eventName, node, options ){
			if( eventName == 'listener' )
				return Frozen.createListener( node );

			return Frozen.update( eventName, node, options );
		};

		var freeze = function(){};
		if( !mutable )
			freeze = function( obj ){ Object.freeze( obj ); };

		// Create the frozen object
		frozen = Frozen.freeze( initialValue, notify, freeze );

		// Listen to its changes immediately
		var listener = frozen.getListener();

		// Updating flag to trigger the event on nextTick
		var updating = false;

		listener.on( 'immediate', function( prevNode, updated ){
			if( prevNode != frozen )
				return;

			frozen = updated;

			// Trigger on next tick
			if( !updating ){
				updating = true;
				Utils.nextTick( function(){
					updating = false;
					me.trigger( 'update', frozen );
				});
			}
		});

		Utils.addNE( this, {
			get: function(){
				return frozen;
			},
			set: function( node ){
				var newNode = notify( 'reset', frozen, node );
				newNode.__.listener.trigger( 'immediate', frozen, newNode );
			}
		});

		Utils.addNE( this, { getData: this.get, setData: this.set } );

		// The event store
		this._events = [];
	}

	Freezer.prototype = Utils.createNonEnumerable({}, Emitter);
	//#build

	module.exports = Freezer;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var objToStr = function(x){ return Object.prototype.toString.call(x); };

	var thrower = function(error){
	    throw error;
	};

	var mixins = module.exports = function makeMixinFunction(rules, _opts){
	    var opts = _opts || {};
	    if (!opts.unknownFunction) {
	        opts.unknownFunction = mixins.ONCE;
	    }

	    if (!opts.nonFunctionProperty) {
	        opts.nonFunctionProperty = function(left, right, key){
	            if (left !== undefined && right !== undefined) {
	                var getTypeName = function(obj){
	                    if (obj && obj.constructor && obj.constructor.name) {
	                        return obj.constructor.name;
	                    }
	                    else {
	                        return objToStr(obj).slice(8, -1);
	                    }
	                };
	                throw new TypeError('Cannot mixin key ' + key + ' because it is provided by multiple sources, '
	                        + 'and the types are ' + getTypeName(left) + ' and ' + getTypeName(right));
	            }
	            return left === undefined ? right : left;
	        };
	    }

	    function setNonEnumerable(target, key, value){
	        if (key in target){
	            target[key] = value;
	        }
	        else {
	            Object.defineProperty(target, key, {
	                value: value,
	                writable: true,
	                configurable: true
	            });
	        }
	    }

	    return function applyMixin(source, mixin){
	        Object.keys(mixin).forEach(function(key){
	            var left = source[key], right = mixin[key], rule = rules[key];

	            // this is just a weird case where the key was defined, but there's no value
	            // behave like the key wasn't defined
	            if (left === undefined && right === undefined) return;

	            var wrapIfFunction = function(thing){
	                return typeof thing !== "function" ? thing
	                : function(){
	                    return thing.call(this, arguments);
	                };
	            };

	            // do we have a rule for this key?
	            if (rule) {
	                // may throw here
	                var fn = rule(left, right, key);
	                setNonEnumerable(source, key, wrapIfFunction(fn));
	                return;
	            }

	            var leftIsFn = typeof left === "function";
	            var rightIsFn = typeof right === "function";

	            // check to see if they're some combination of functions or undefined
	            // we already know there's no rule, so use the unknown function behavior
	            if (leftIsFn && right === undefined
	             || rightIsFn && left === undefined
	             || leftIsFn && rightIsFn) {
	                // may throw, the default is ONCE so if both are functions
	                // the default is to throw
	                setNonEnumerable(source, key, wrapIfFunction(opts.unknownFunction(left, right, key)));
	                return;
	            }

	            // we have no rule for them, one may be a function but one or both aren't
	            // our default is MANY_MERGED_LOOSE which will merge objects, concat arrays
	            // and throw if there's a type mismatch or both are primitives (how do you merge 3, and "foo"?)
	            source[key] = opts.nonFunctionProperty(left, right, key);
	        });
	    };
	};

	mixins._mergeObjects = function(obj1, obj2) {
	    var assertObject = function(obj, obj2){
	        var type = objToStr(obj);
	        if (type !== '[object Object]') {
	            var displayType = obj.constructor ? obj.constructor.name : 'Unknown';
	            var displayType2 = obj2.constructor ? obj2.constructor.name : 'Unknown';
	            thrower('cannot merge returned value of type ' + displayType + ' with an ' + displayType2);
	        }
	    };

	    if (Array.isArray(obj1) && Array.isArray(obj2)) {
	        return obj1.concat(obj2);
	    }

	    assertObject(obj1, obj2);
	    assertObject(obj2, obj1);

	    var result = {};
	    Object.keys(obj1).forEach(function(k){
	        if (Object.prototype.hasOwnProperty.call(obj2, k)) {
	            thrower('cannot merge returns because both have the ' + JSON.stringify(k) + ' key');
	        }
	        result[k] = obj1[k];
	    });

	    Object.keys(obj2).forEach(function(k){
	        // we can skip the conflict check because all conflicts would already be found
	        result[k] = obj2[k];
	    });
	    return result;

	}

	// define our built-in mixin types
	mixins.ONCE = function(left, right, key){
	    if (left && right) {
	        throw new TypeError('Cannot mixin ' + key + ' because it has a unique constraint.');
	    }

	    var fn = left || right;

	    return function(args){
	        return fn.apply(this, args);
	    };
	};

	mixins.MANY = function(left, right, key){
	    return function(args){
	        if (right) right.apply(this, args);
	        return left ? left.apply(this, args) : undefined;
	    };
	};

	mixins.MANY_MERGED_LOOSE = function(left, right, key) {
	    if(left && right) {
	        return mixins._mergeObjects(left, right);
	    }

	    return left || right;
	}

	mixins.MANY_MERGED = function(left, right, key){
	    return function(args){
	        var res1 = right && right.apply(this, args);
	        var res2 = left && left.apply(this, args);
	        if (res1 && res2) {
	            return mixins._mergeObjects(res1, res2)
	        }
	        return res2 || res1;
	    };
	};


	mixins.REDUCE_LEFT = function(_left, _right, key){
	    var left = _left || function(){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return right.call(this, left.apply(this, args));
	    };
	};

	mixins.REDUCE_RIGHT = function(_left, _right, key){
	    var left = _left || function(){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return left.call(this, right.apply(this, args));
	    };
	};



/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//#build
	var global = (new Function("return this")());

	var Utils = {
		extend: function( ob, props ){
			for( var p in props ){
				ob[p] = props[p];
			}
			return ob;
		},

		createNonEnumerable: function( obj, proto ){
			var ne = {};
			for( var key in obj )
				ne[key] = {value: obj[key] };
			return Object.create( proto || {}, ne );
		},

		error: function( message ){
			var err = new Error( message );
			if( console )
				return console.error( err );
			else
				throw err;
		},

		each: function( o, clbk ){
			var i,l,keys;
			if( o && o.constructor == Array ){
				for (i = 0, l = o.length; i < l; i++)
					clbk( o[i], i );
			}
			else {
				keys = Object.keys( o );
				for( i = 0, l = keys.length; i < l; i++ )
					clbk( o[ keys[i] ], keys[i] );
			}
		},

		addNE: function( node, attrs ){
			for( var key in attrs ){
				Object.defineProperty( node, key, {
					enumerable: false,
					configurable: true,
					writable: true,
					value: attrs[ key ]
				});
			}
		},

		// nextTick - by stagas / public domain
	  	nextTick: (function () {
	      var queue = [],
				dirty = false,
				fn,
				hasPostMessage = !!global.postMessage,
				messageName = 'nexttick',
				trigger = (function () {
					return hasPostMessage
						? function trigger () {
						global.postMessage(messageName, '*');
					}
					: function trigger () {
						setTimeout(function () { processQueue() }, 0);
					};
				}()),
				processQueue = (function () {
					return hasPostMessage
						? function processQueue (event) {
							if (event.source === global && event.data === messageName) {
								event.stopPropagation();
								flushQueue();
							}
						}
						: flushQueue;
	      	})()
	      ;

	      function flushQueue () {
	          while (fn = queue.shift()) {
	              fn();
	          }
	          dirty = false;
	      }

	      function nextTick (fn) {
	          queue.push(fn);
	          if (dirty) return;
	          dirty = true;
	          trigger();
	      }

	      if (hasPostMessage) global.addEventListener('message', processQueue, true);

	      nextTick.removeListener = function () {
	          global.removeEventListener('message', processQueue, true);
	      }

	      return nextTick;
	  })()
	};
	//#build


	module.exports = Utils;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__( 13 );

	//#build

	// The prototype methods are stored in a different object
	// and applied as non enumerable properties later
	var emitterProto = {
		on: function( eventName, listener, once ){
			var listeners = this._events[ eventName ] || [];

			listeners.push({ callback: listener, once: once});
			this._events[ eventName ] =  listeners;

			return this;
		},

		once: function( eventName, listener ){
			this.on( eventName, listener, true );
		},

		off: function( eventName, listener ){
			if( typeof eventName == 'undefined' ){
				this._events = {};
			}
			else if( typeof listener == 'undefined' ) {
				this._events[ eventName ] = [];
			}
			else {
				var listeners = this._events[ eventName ] || [],
					i
				;

				for (i = listeners.length - 1; i >= 0; i--) {
					if( listeners[i] === listener )
						listeners.splice( i, 1 );
				}
			}

			return this;
		},

		trigger: function( eventName ){
			var args = [].slice.call( arguments, 1 ),
				listeners = this._events[ eventName ] || [],
				onceListeners = [],
				i, listener
			;

			// Call listeners
			for (i = 0; i < listeners.length; i++) {
				listener = listeners[i];

				if( listener.callback )
					listener.callback.apply( null, args );
				else {
					// If there is not a callback, remove!
					listener.once = true;
				}

				if( listener.once )
					onceListeners.push( i );
			}

			// Remove listeners marked as once
			for( i = onceListeners.length - 1; i >= 0; i-- ){
				listeners.splice( onceListeners[i], 1 );
			}

			return this;
		}
	};

	// Methods are not enumerable so, when the stores are
	// extended with the emitter, they can be iterated as
	// hashmaps
	var Emitter = Utils.createNonEnumerable( emitterProto );
	//#build

	module.exports = Emitter;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__( 13 );

	//#build

	/**
	 * Creates non-enumerable property descriptors, to be used by Object.create.
	 * @param  {Object} attrs Properties to create descriptors
	 * @return {Object}       A hash with the descriptors.
	 */
	var createNE = function( attrs ){
		var ne = {};

		for( var key in attrs ){
			ne[ key ] = {
				writable: true,
				configurable: true,
				enumerable: false,
				value: attrs[ key]
			}
		}

		return ne;
	}

	var commonMethods = {
		set: function( attr, value ){
			var attrs = attr,
				update = this.__.trans
			;

			if( typeof value != 'undefined' ){
				attrs = {};
				attrs[ attr ] = value;
			}

			if( !update ){
				for( var key in attrs ){
					update = update || this[ key ] != attrs[ key ];
				}

				// No changes, just return the node
				if( !update )
					return this;
			}

			return this.__.notify( 'merge', this, attrs );
		},

		reset: function( attrs ) {
			return this.__.notify( 'replace', this, attrs );
		},

		getListener: function(){
			return this.__.notify( 'listener', this );
		},

		toJS: function(){
			var js;
			if( this.constructor == Array ){
				js = new Array( this.length );
			}
			else {
				js = {};
			}

			Utils.each( this, function( child, i ){
				if( child && child.__ )
					js[ i ] = child.toJS();
				else
					js[ i ] = child;
			});

			return js;
		},

		transact: function(){
			return this.__.notify( 'transact', this );
		},
		run: function(){
			return this.__.notify( 'run', this );
		}
	};

	var arrayMethods = Utils.extend({
		push: function( el ){
			return this.append( [el] );
		},

		append: function( els ){
			if( els && els.length )
				return this.__.notify( 'splice', this, [this.length, 0].concat( els ) );
			return this;
		},

		pop: function(){
			if( !this.length )
				return this;

			return this.__.notify( 'splice', this, [this.length -1, 1] );
		},

		unshift: function( el ){
			return this.prepend( [el] );
		},

		prepend: function( els ){
			if( els && els.length )
				return this.__.notify( 'splice', this, [0, 0].concat( els ) );
			return this;
		},

		shift: function(){
			if( !this.length )
				return this;

			return this.__.notify( 'splice', this, [0, 1] );
		},

		splice: function( index, toRemove, toAdd ){
			return this.__.notify( 'splice', this, arguments );
		}
	}, commonMethods );

	var FrozenArray = Object.create( Array.prototype, createNE( arrayMethods ) );

	var Mixins = {

	Hash: Object.create( Object.prototype, createNE( Utils.extend({
		remove: function( keys ){
			var filtered = [],
				k = keys
			;

			if( keys.constructor != Array )
				k = [ keys ];

			for( var i = 0, l = k.length; i<l; i++ ){
				if( this.hasOwnProperty( k[i] ) )
					filtered.push( k[i] );
			}

			if( filtered.length )
				return this.__.notify( 'remove', this, filtered );
			return this;
		}
	}, commonMethods))),

	List: FrozenArray,
	arrayMethods: arrayMethods
	};
	//#build

	module.exports = Mixins;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__( 13 ),
		Mixins = __webpack_require__( 15),
		Emitter = __webpack_require__(14)
	;

	//#build
	var Frozen = {
		freeze: function( node, notify, freezeFn ){
			if( node && node.__ ){
				return node;
			}

			var me = this,
				frozen, mixin, cons
			;

			if( node.constructor == Array ){
				frozen = this.createArray( node.length );
			}
			else {
				frozen = Object.create( Mixins.Hash );
			}

			Utils.addNE( frozen, { __: {
				listener: false,
				parents: [],
				notify: notify,
				dirty: false,
				freezeFn: freezeFn
			}});

			// Freeze children
			Utils.each( node, function( child, key ){
				cons = child && child.constructor;
				if( cons == Array || cons == Object ){
					child = me.freeze( child, notify, freezeFn );
				}

				if( child && child.__ ){
					me.addParent( child, frozen );
				}

				frozen[ key ] = child;
			});

			freezeFn( frozen );

			return frozen;
		},

		update: function( type, node, options ){
			if( !this[ type ])
				return Utils.error( 'Unknown update type: ' + type );

			return this[ type ]( node, options );
		},

		reset: function( node, value ){
			var me = this,
				frozen
			;

			if( value && value.__ ){
				frozen = value;
				frozen.__.listener = value.__.listener;
				frozen.__.parents = [];

				// Set back the parent on the children
				// that have been updated
				this.fixChildren( frozen, node );
				Utils.each( frozen, function( child ){
					if( child && child.__ ){
						me.removeParent( node );
						me.addParent( child, frozen );
					}
				});
			}
			else {
				frozen = this.freeze( node, node.__.notify, node.__.freezeFn );
			}

			return frozen;
		},

		merge: function( node, attrs ){
			var trans = node.__.trans;

			if( trans ){

				for( var attr in attrs )
					trans[ attr ] = attrs[ attr ];
				return node;
			}

			var me = this,
				frozen = this.copyMeta( node ),
				notify = node.__.notify,
				val, cons, key, isFrozen
			;

			Utils.each( node, function( child, key ){
				isFrozen = child && child.__;

				if( isFrozen ){
					me.removeParent( child, node );
				}

				val = attrs[ key ];
				if( !val ){
					if( isFrozen )
						me.addParent( child, frozen );
					return frozen[ key ] = child;
				}

				cons = val && val.constructor;

				if( cons == Array || cons == Object )
					val = me.freeze( val, notify, node.__.freezeFn );

				if( val && val.__ )
					me.addParent( val, frozen );

				delete attrs[ key ];

				frozen[ key ] = val;
			});

			for( key in attrs ) {
				val = attrs[ key ];
				cons = val && val.constructor;

				if( cons == Array || cons == Object )
					val = me.freeze( val, notify, node.__.freezeFn );

				if( val && val.__ )
					me.addParent( val, frozen );

				frozen[ key ] = val;
			}

			node.__.freezeFn( frozen );

			this.refreshParents( node, frozen );

			return frozen;
		},

		replace: function( node, replacement ) {

			var me = this,
				cons = replacement && replacement.constructor,
				__ = node.__,
				frozen = replacement
			;

			if( cons == Array || cons == Object ) {

				frozen = me.freeze( replacement, __.notify, __.freezeFn );

				frozen.__.parents = __.parents;

				// Add the current listener if exists, replacing a
				// previous listener in the frozen if existed
				if( __.listener )
					frozen.__.listener = node.__.listener;

				// Since the parents will be refreshed directly,
				// Trigger the listener here
				if( frozen.__.listener )
					this.trigger( frozen, 'update', frozen );
			}

			// Refresh the parent nodes directly
			for (var i = __.parents.length - 1; i >= 0; i--) {
				if( i == 0 ){
					this.refresh( __.parents[i], node, frozen, false );
				}
				else{

					this.markDirty( __.parents[i], [node, frozen] );
				}
			}
			return frozen;
		},

		remove: function( node, attrs ){
			var trans = node.__.trans;
			if( trans ){
				for( var l = attrs.length - 1; l >= 0; l-- )
					delete trans[ attrs[l] ];
				return node;
			}

			var me = this,
				frozen = this.copyMeta( node ),
				isFrozen
			;

			Utils.each( node, function( child, key ){
				isFrozen = child && child.__;

				if( isFrozen ){
					me.removeParent( child, node );
				}

				if( attrs.indexOf( key ) != -1 ){
					return;
				}

				if( isFrozen )
					me.addParent( child, frozen );

				frozen[ key ] = child;
			});

			node.__.freezeFn( frozen );
			this.refreshParents( node, frozen );

			return frozen;
		},

		splice: function( node, args ){
			var trans = node.__.trans;
			if( trans ){
				trans.splice.apply( trans, args );
				return node;
			}

			var me = this,
				frozen = this.copyMeta( node ),
				index = args[0],
				deleteIndex = index + args[1],
				__ = node.__,
				con, child
			;

			// Clone the array
			Utils.each( node, function( child, i ){

				if( child && child.__ ){
					me.removeParent( child, node );

					// Skip the nodes to delete
					if( i < index || i>= deleteIndex )
						me.addParent( child, frozen );
				}

				frozen[i] = child;
			});

			// Prepare the new nodes
			if( args.length > 1 ){
				for (var i = args.length - 1; i >= 2; i--) {
					child = args[i];
					con = child && child.constructor;

					if( con == Array || con == Object )
						child = this.freeze( child, __.notify, __.freezeFn );

					if( child && child.__ )
						this.addParent( child, frozen );

					args[i] = child;
				}
			}

			// splice
			Array.prototype.splice.apply( frozen, args );

			node.__.freezeFn( frozen );
			this.refreshParents( node, frozen );

			return frozen;
		},

		transact: function( node ) {
			var me = this,
				transacting = node.__.trans,
				trans
			;

			if( transacting )
				return transacting;

			trans = node.constructor == Array ? [] : {};

			Utils.each( node, function( child, key ){
				trans[ key ] = child;
			});

			node.__.trans = trans;

			// Call run automatically in case
			// the user forgot about it
			Utils.nextTick( function(){
				if( node.__.trans )
					me.run( node );
			});

			return trans;
		},

		run: function( node ) {
			var me = this,
				trans = node.__.trans
			;

			if( !trans )
				return node;

			// Remove the node as a parent
			Utils.each( trans, function( child, key ){
				if( child && child.__ ){
					me.removeParent( child, node );
				}
			});

			delete node.__.trans;

			var result = this.replace( node, trans );
			return result;
		},

		refresh: function( node, oldChild, newChild, returnUpdated ){
			var me = this,
				trans = node.__.trans,
				found = 0
			;

			if( trans ){

				Utils.each( trans, function( child, key ){
					if( found ) return;

					if( child == oldChild ){

						trans[ key ] = newChild;
						found = 1;

						if( newChild && newChild.__ )
							me.addParent( newChild, node );
					}
				});

				return node;
			}

			var frozen = this.copyMeta( node ),
				dirty = node.__.dirty,
				dirt, replacement, __
			;

			if( dirty ){
				dirt = dirty[0],
				replacement = dirty[1]
			}

			Utils.each( node, function( child, key ){
				if( child == oldChild ){
					child = newChild;
				}
				else if( child == dirt ){
					child = replacement;
				}

				if( child && (__ = child.__) ){

					// If there is a trans happening we
					// don't update a dirty node now. The update
					// will occur on run.
					if( !__.trans && __.dirty ){
						child = me.refresh( child, __.dirty[0], __.dirty[1], true );
					}


					me.removeParent( child, node );
					me.addParent( child, frozen );
				}

				frozen[ key ] = child;
			});

			node.__.freezeFn( frozen );

			// If the node was dirty, clean it
			node.__.dirty = false;

			if( returnUpdated )
				return frozen;

			this.refreshParents( node, frozen );
		},

		fixChildren: function( node, oldNode ){
			var me = this;
			Utils.each( node, function( child ){
				if( !child || !child.__ )
					return;

				// If the child is linked to the node,
				// maybe its children are not linked
				if( child.__.parents.indexOf( node ) != -1 )
					return me.fixChildren( child );

				// If the child wasn't linked it is sure
				// that it wasn't modified. Just link it
				// to the new parent
				if( child.__.parents.length == 1 )
					return child.__.parents = [ node ];

				if( oldNode )
					me.removeParent( child, oldNode );

				me.addParent( node );
			});
		},

		copyMeta: function( node ){
			var me = this,
				frozen
			;

			if( node.constructor == Array ){
				frozen = this.createArray( node.length );
			}
			else {
				frozen = Object.create( Mixins.Hash );
			}

			var __ = node.__;

			Utils.addNE( frozen, {__: {
				notify: __.notify,
				listener: __.listener,
				parents: __.parents.slice( 0 ),
				trans: __.trans,
				dirty: false,
				freezeFn: __.freezeFn
			}});

			return frozen;
		},

		refreshParents: function( oldChild, newChild ){
			var __ = oldChild.__,
				i
			;

			if( __.listener )
				this.trigger( newChild, 'update', newChild );

			if( !__.parents.length ){
				if( __.listener ){
					__.listener.trigger( 'immediate', oldChild, newChild );
				}
			}
			else {
				for (i = __.parents.length - 1; i >= 0; i--) {
					// If there is more than one parent, mark everyone as dirty
					// but the last in the iteration, and when the last is refreshed
					// it will update the dirty nodes.
					if( i == 0 )
						this.refresh( __.parents[i], oldChild, newChild, false );
					else{

						this.markDirty( __.parents[i], [oldChild, newChild] );
					}
				}
			}
		},

		markDirty: function( node, dirt ){
			var __ = node.__,
				i
			;
			__.dirty = dirt;

			// If there is a transaction happening in the node
			// update the transaction data immediately
			if( __.trans )
				this.refresh( node, dirt[0], dirt[1] );

			for ( i = __.parents.length - 1; i >= 0; i-- ) {

				this.markDirty( __.parents[i], dirt );
			}
		},

		removeParent: function( node, parent ){
			var parents = node.__.parents,
				index = parents.indexOf( parent )
			;

			if( index != -1 ){

				parents.splice( index, 1 );
			}
		},

		addParent: function( node, parent ){
			var parents = node.__.parents,
				index = parents.indexOf( parent )
			;

			if( index == -1 ){
				parents[ parents.length ] = parent;
			}
		},

		trigger: function( node, eventName, param ){
			var listener = node.__.listener,
				ticking = listener.ticking
			;

			listener.ticking = param;
			if( !ticking ){
				Utils.nextTick( function(){
					var updated = listener.ticking;
					listener.ticking = false;
					listener.trigger( eventName, updated );
				});
			}
		},

		createListener: function( frozen ){
			var l = frozen.__.listener;

			if( !l ) {
				l = Object.create(Emitter, {
					_events: {
						value: {},
						writable: true
					}
				});

				frozen.__.listener = l;
			}

			return l;
		},

		createArray: (function(){
			// Set createArray method
			if( [].__proto__ )
				return function( length ){
					var arr = new Array( length );
					arr.__proto__ = Mixins.List;
					return arr;
				}
			return function( length ){
				var arr = new Array( length ),
					methods = Mixins.arrayMethods
				;
				for( var m in methods ){
					arr[ m ] = methods[ m ];
				}
				return arr;
			}
		})()
	};
	//#build

	module.exports = Frozen;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ }
/******/ ])
});
;