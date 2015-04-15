(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Tessel"] = factory();
	else
		root["Tessel"] = factory();
})(this, function() {
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

	var _Freezer = __webpack_require__(4);

	var _Freezer2 = _interopRequireWildcard(_Freezer);

	/**
	 * Tessel abstracts tracker reactivity and uses immutable datastructures
	 * pointed by cursors.
	 */

	var Tessel = (function () {
	  function Tessel(data) {
	    _classCallCheck(this, Tessel);

	    // Data holder instances
	    var reactiveVar = this._reactiveVar = new _ReactiveVar2['default']();
	    var store = this._store = new _Freezer2['default'](data || {});

	    // Setup in the reactive variable the correct value
	    reactiveVar.set(store.get());

	    // Setup listener for when the store updates
	    store.on('update', function () {
	      // This will trigger tracker autorun
	      reactiveVar.set(store.get());
	    });
	  }

	  _createClass(Tessel, [{
	    key: 'set',
	    value: function set(data) {
	      this._store.set(data);
	    }
	  }, {
	    key: 'get',
	    value: function get(key) {
	      return this._reactiveVar.get();
	    }
	  }], [{
	    key: 'Tracker',
	    value: _Tracker2['default'],
	    enumerable: true
	  }, {
	    key: 'autorun',
	    value: function autorun() {
	      _Tracker2['default'].autorun.apply(this, arguments);
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

	var Freezer = __webpack_require__(5);
	module.exports = Freezer;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__(6),
	    Emitter = __webpack_require__(7),
	    Mixins = __webpack_require__(8),
	    Frozen = __webpack_require__(9);

	//#build
	var Freezer = function Freezer(initialValue, mutable) {
		var me = this;

		// Immutable data
		var frozen;

		var notify = function notify(eventName, node, options) {
			if (eventName == 'listener') {
				return Frozen.createListener(node);
			}return Frozen.update(eventName, node, options);
		};

		var freeze = function freeze() {};
		if (!mutable) freeze = function (obj) {
			Object.freeze(obj);
		};

		// Create the frozen object
		frozen = Frozen.freeze(initialValue, notify, freeze);

		// Listen to its changes immediately
		var listener = frozen.getListener();

		// Updating flag to trigger the event on nextTick
		var updating = false;

		listener.on('immediate', function (prevNode, updated) {
			if (prevNode != frozen) return;

			frozen = updated;

			// Trigger on next tick
			if (!updating) {
				updating = true;
				Utils.nextTick(function () {
					updating = false;
					me.trigger('update', frozen);
				});
			}
		});

		Utils.addNE(this, {
			get: function get() {
				return frozen;
			},
			set: function set(node) {
				var newNode = notify('reset', frozen, node);
				newNode.__.listener.trigger('immediate', frozen, newNode);
			}
		});

		Utils.addNE(this, { getData: this.get, setData: this.set });

		// The event store
		this._events = [];
	};

	Freezer.prototype = Utils.createNonEnumerable({}, Emitter);
	//#build

	module.exports = Freezer;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//#build
	var global = new Function('return this')();

	var Utils = {
		extend: function extend(ob, props) {
			for (var p in props) {
				ob[p] = props[p];
			}
			return ob;
		},

		createNonEnumerable: function createNonEnumerable(obj, proto) {
			var ne = {};
			for (var key in obj) ne[key] = { value: obj[key] };
			return Object.create(proto || {}, ne);
		},

		error: function error(message) {
			var err = new Error(message);
			if (console) {
				return console.error(err);
			} else throw err;
		},

		each: function each(o, clbk) {
			var i, l, keys;
			if (o && o.constructor == Array) {
				for (i = 0, l = o.length; i < l; i++) clbk(o[i], i);
			} else {
				keys = Object.keys(o);
				for (i = 0, l = keys.length; i < l; i++) clbk(o[keys[i]], keys[i]);
			}
		},

		addNE: function addNE(node, attrs) {
			for (var key in attrs) {
				Object.defineProperty(node, key, {
					enumerable: false,
					configurable: true,
					writable: true,
					value: attrs[key]
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
				return hasPostMessage ? function trigger() {
					global.postMessage(messageName, '*');
				} : function trigger() {
					setTimeout(function () {
						processQueue();
					}, 0);
				};
			})(),
			    processQueue = (function () {
				return hasPostMessage ? function processQueue(event) {
					if (event.source === global && event.data === messageName) {
						event.stopPropagation();
						flushQueue();
					}
				} : flushQueue;
			})();

			function flushQueue() {
				while (fn = queue.shift()) {
					fn();
				}
				dirty = false;
			}

			function nextTick(fn) {
				queue.push(fn);
				if (dirty) {
					return;
				}dirty = true;
				trigger();
			}

			if (hasPostMessage) global.addEventListener('message', processQueue, true);

			nextTick.removeListener = function () {
				global.removeEventListener('message', processQueue, true);
			};

			return nextTick;
		})()
	};
	//#build

	module.exports = Utils;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__(6);

	//#build

	// The prototype methods are stored in a different object
	// and applied as non enumerable properties later
	var emitterProto = {
		on: function on(eventName, listener, once) {
			var listeners = this._events[eventName] || [];

			listeners.push({ callback: listener, once: once });
			this._events[eventName] = listeners;

			return this;
		},

		once: function once(eventName, listener) {
			this.on(eventName, listener, true);
		},

		off: function off(eventName, listener) {
			if (typeof eventName == 'undefined') {
				this._events = {};
			} else if (typeof listener == 'undefined') {
				this._events[eventName] = [];
			} else {
				var listeners = this._events[eventName] || [],
				    i;

				for (i = listeners.length - 1; i >= 0; i--) {
					if (listeners[i] === listener) listeners.splice(i, 1);
				}
			}

			return this;
		},

		trigger: function trigger(eventName) {
			var args = [].slice.call(arguments, 1),
			    listeners = this._events[eventName] || [],
			    onceListeners = [],
			    i,
			    listener;

			// Call listeners
			for (i = 0; i < listeners.length; i++) {
				listener = listeners[i];

				if (listener.callback) listener.callback.apply(null, args);else {
					// If there is not a callback, remove!
					listener.once = true;
				}

				if (listener.once) onceListeners.push(i);
			}

			// Remove listeners marked as once
			for (i = onceListeners.length - 1; i >= 0; i--) {
				listeners.splice(onceListeners[i], 1);
			}

			return this;
		}
	};

	// Methods are not enumerable so, when the stores are
	// extended with the emitter, they can be iterated as
	// hashmaps
	var Emitter = Utils.createNonEnumerable(emitterProto);
	//#build

	module.exports = Emitter;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__(6);

	//#build

	/**
	 * Creates non-enumerable property descriptors, to be used by Object.create.
	 * @param  {Object} attrs Properties to create descriptors
	 * @return {Object}       A hash with the descriptors.
	 */
	var createNE = function createNE(attrs) {
		var ne = {};

		for (var key in attrs) {
			ne[key] = {
				writable: true,
				configurable: true,
				enumerable: false,
				value: attrs[key]
			};
		}

		return ne;
	};

	var commonMethods = {
		set: function set(attr, value) {
			var attrs = attr,
			    update = this.__.trans;

			if (typeof value != 'undefined') {
				attrs = {};
				attrs[attr] = value;
			}

			if (!update) {
				for (var key in attrs) {
					update = update || this[key] != attrs[key];
				}

				// No changes, just return the node
				if (!update) {
					return this;
				}
			}

			return this.__.notify('merge', this, attrs);
		},

		reset: function reset(attrs) {
			return this.__.notify('replace', this, attrs);
		},

		getListener: function getListener() {
			return this.__.notify('listener', this);
		},

		toJS: function toJS() {
			var js;
			if (this.constructor == Array) {
				js = new Array(this.length);
			} else {
				js = {};
			}

			Utils.each(this, function (child, i) {
				if (child && child.__) js[i] = child.toJS();else js[i] = child;
			});

			return js;
		},

		transact: function transact() {
			return this.__.notify('transact', this);
		},
		run: function run() {
			return this.__.notify('run', this);
		}
	};

	var arrayMethods = Utils.extend({
		push: function push(el) {
			return this.append([el]);
		},

		append: function append(els) {
			if (els && els.length) {
				return this.__.notify('splice', this, [this.length, 0].concat(els));
			}return this;
		},

		pop: function pop() {
			if (!this.length) {
				return this;
			}return this.__.notify('splice', this, [this.length - 1, 1]);
		},

		unshift: function unshift(el) {
			return this.prepend([el]);
		},

		prepend: function prepend(els) {
			if (els && els.length) {
				return this.__.notify('splice', this, [0, 0].concat(els));
			}return this;
		},

		shift: function shift() {
			if (!this.length) {
				return this;
			}return this.__.notify('splice', this, [0, 1]);
		},

		splice: function splice(index, toRemove, toAdd) {
			return this.__.notify('splice', this, arguments);
		}
	}, commonMethods);

	var FrozenArray = Object.create(Array.prototype, createNE(arrayMethods));

	var Mixins = {

		Hash: Object.create(Object.prototype, createNE(Utils.extend({
			remove: function remove(keys) {
				var filtered = [],
				    k = keys;

				if (keys.constructor != Array) k = [keys];

				for (var i = 0, l = k.length; i < l; i++) {
					if (this.hasOwnProperty(k[i])) filtered.push(k[i]);
				}

				if (filtered.length) {
					return this.__.notify('remove', this, filtered);
				}return this;
			}
		}, commonMethods))),

		List: FrozenArray,
		arrayMethods: arrayMethods
	};
	//#build

	module.exports = Mixins;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Utils = __webpack_require__(6),
	    Mixins = __webpack_require__(8),
	    Emitter = __webpack_require__(7);

	//#build
	var Frozen = {
		freeze: function freeze(node, notify, freezeFn) {
			if (node && node.__) {
				return node;
			}

			var me = this,
			    frozen,
			    mixin,
			    cons;

			if (node.constructor == Array) {
				frozen = this.createArray(node.length);
			} else {
				frozen = Object.create(Mixins.Hash);
			}

			Utils.addNE(frozen, { __: {
					listener: false,
					parents: [],
					notify: notify,
					dirty: false,
					freezeFn: freezeFn
				} });

			// Freeze children
			Utils.each(node, function (child, key) {
				cons = child && child.constructor;
				if (cons == Array || cons == Object) {
					child = me.freeze(child, notify, freezeFn);
				}

				if (child && child.__) {
					me.addParent(child, frozen);
				}

				frozen[key] = child;
			});

			freezeFn(frozen);

			return frozen;
		},

		update: function update(type, node, options) {
			if (!this[type]) {
				return Utils.error('Unknown update type: ' + type);
			}return this[type](node, options);
		},

		reset: function reset(node, value) {
			var me = this,
			    frozen;

			if (value && value.__) {
				frozen = value;
				frozen.__.listener = value.__.listener;
				frozen.__.parents = [];

				// Set back the parent on the children
				// that have been updated
				this.fixChildren(frozen, node);
				Utils.each(frozen, function (child) {
					if (child && child.__) {
						me.removeParent(node);
						me.addParent(child, frozen);
					}
				});
			} else {
				frozen = this.freeze(node, node.__.notify, node.__.freezeFn);
			}

			return frozen;
		},

		merge: function merge(node, attrs) {
			var trans = node.__.trans;

			if (trans) {

				for (var attr in attrs) trans[attr] = attrs[attr];
				return node;
			}

			var me = this,
			    frozen = this.copyMeta(node),
			    notify = node.__.notify,
			    val,
			    cons,
			    key,
			    isFrozen;

			Utils.each(node, function (child, key) {
				isFrozen = child && child.__;

				if (isFrozen) {
					me.removeParent(child, node);
				}

				val = attrs[key];
				if (!val) {
					if (isFrozen) me.addParent(child, frozen);
					return frozen[key] = child;
				}

				cons = val && val.constructor;

				if (cons == Array || cons == Object) val = me.freeze(val, notify, node.__.freezeFn);

				if (val && val.__) me.addParent(val, frozen);

				delete attrs[key];

				frozen[key] = val;
			});

			for (key in attrs) {
				val = attrs[key];
				cons = val && val.constructor;

				if (cons == Array || cons == Object) val = me.freeze(val, notify, node.__.freezeFn);

				if (val && val.__) me.addParent(val, frozen);

				frozen[key] = val;
			}

			node.__.freezeFn(frozen);

			this.refreshParents(node, frozen);

			return frozen;
		},

		replace: function replace(node, replacement) {

			var me = this,
			    cons = replacement && replacement.constructor,
			    __ = node.__,
			    frozen = replacement;

			if (cons == Array || cons == Object) {

				frozen = me.freeze(replacement, __.notify, __.freezeFn);

				frozen.__.parents = __.parents;

				// Add the current listener if exists, replacing a
				// previous listener in the frozen if existed
				if (__.listener) frozen.__.listener = node.__.listener;

				// Since the parents will be refreshed directly,
				// Trigger the listener here
				if (frozen.__.listener) this.trigger(frozen, 'update', frozen);
			}

			// Refresh the parent nodes directly
			for (var i = __.parents.length - 1; i >= 0; i--) {
				if (i == 0) {
					this.refresh(__.parents[i], node, frozen, false);
				} else {

					this.markDirty(__.parents[i], [node, frozen]);
				}
			}
			return frozen;
		},

		remove: function remove(node, attrs) {
			var trans = node.__.trans;
			if (trans) {
				for (var l = attrs.length - 1; l >= 0; l--) delete trans[attrs[l]];
				return node;
			}

			var me = this,
			    frozen = this.copyMeta(node),
			    isFrozen;

			Utils.each(node, function (child, key) {
				isFrozen = child && child.__;

				if (isFrozen) {
					me.removeParent(child, node);
				}

				if (attrs.indexOf(key) != -1) {
					return;
				}

				if (isFrozen) me.addParent(child, frozen);

				frozen[key] = child;
			});

			node.__.freezeFn(frozen);
			this.refreshParents(node, frozen);

			return frozen;
		},

		splice: function splice(node, args) {
			var trans = node.__.trans;
			if (trans) {
				trans.splice.apply(trans, args);
				return node;
			}

			var me = this,
			    frozen = this.copyMeta(node),
			    index = args[0],
			    deleteIndex = index + args[1],
			    __ = node.__,
			    con,
			    child;

			// Clone the array
			Utils.each(node, function (child, i) {

				if (child && child.__) {
					me.removeParent(child, node);

					// Skip the nodes to delete
					if (i < index || i >= deleteIndex) me.addParent(child, frozen);
				}

				frozen[i] = child;
			});

			// Prepare the new nodes
			if (args.length > 1) {
				for (var i = args.length - 1; i >= 2; i--) {
					child = args[i];
					con = child && child.constructor;

					if (con == Array || con == Object) child = this.freeze(child, __.notify, __.freezeFn);

					if (child && child.__) this.addParent(child, frozen);

					args[i] = child;
				}
			}

			// splice
			Array.prototype.splice.apply(frozen, args);

			node.__.freezeFn(frozen);
			this.refreshParents(node, frozen);

			return frozen;
		},

		transact: function transact(node) {
			var me = this,
			    transacting = node.__.trans,
			    trans;

			if (transacting) {
				return transacting;
			}trans = node.constructor == Array ? [] : {};

			Utils.each(node, function (child, key) {
				trans[key] = child;
			});

			node.__.trans = trans;

			// Call run automatically in case
			// the user forgot about it
			Utils.nextTick(function () {
				if (node.__.trans) me.run(node);
			});

			return trans;
		},

		run: function run(node) {
			var me = this,
			    trans = node.__.trans;

			if (!trans) {
				return node;
			} // Remove the node as a parent
			Utils.each(trans, function (child, key) {
				if (child && child.__) {
					me.removeParent(child, node);
				}
			});

			delete node.__.trans;

			var result = this.replace(node, trans);
			return result;
		},

		refresh: function refresh(node, oldChild, newChild, returnUpdated) {
			var me = this,
			    trans = node.__.trans,
			    found = 0;

			if (trans) {

				Utils.each(trans, function (child, key) {
					if (found) return;

					if (child == oldChild) {

						trans[key] = newChild;
						found = 1;

						if (newChild && newChild.__) me.addParent(newChild, node);
					}
				});

				return node;
			}

			var frozen = this.copyMeta(node),
			    dirty = node.__.dirty,
			    dirt,
			    replacement,
			    __;

			if (dirty) {
				dirt = dirty[0], replacement = dirty[1];
			}

			Utils.each(node, function (child, key) {
				if (child == oldChild) {
					child = newChild;
				} else if (child == dirt) {
					child = replacement;
				}

				if (child && (__ = child.__)) {

					// If there is a trans happening we
					// don't update a dirty node now. The update
					// will occur on run.
					if (!__.trans && __.dirty) {
						child = me.refresh(child, __.dirty[0], __.dirty[1], true);
					}

					me.removeParent(child, node);
					me.addParent(child, frozen);
				}

				frozen[key] = child;
			});

			node.__.freezeFn(frozen);

			// If the node was dirty, clean it
			node.__.dirty = false;

			if (returnUpdated) {
				return frozen;
			}this.refreshParents(node, frozen);
		},

		fixChildren: function fixChildren(node, oldNode) {
			var me = this;
			Utils.each(node, function (child) {
				if (!child || !child.__) return;

				// If the child is linked to the node,
				// maybe its children are not linked
				if (child.__.parents.indexOf(node) != -1) return me.fixChildren(child);

				// If the child wasn't linked it is sure
				// that it wasn't modified. Just link it
				// to the new parent
				if (child.__.parents.length == 1) return child.__.parents = [node];

				if (oldNode) me.removeParent(child, oldNode);

				me.addParent(node);
			});
		},

		copyMeta: function copyMeta(node) {
			var me = this,
			    frozen;

			if (node.constructor == Array) {
				frozen = this.createArray(node.length);
			} else {
				frozen = Object.create(Mixins.Hash);
			}

			var __ = node.__;

			Utils.addNE(frozen, { __: {
					notify: __.notify,
					listener: __.listener,
					parents: __.parents.slice(0),
					trans: __.trans,
					dirty: false,
					freezeFn: __.freezeFn
				} });

			return frozen;
		},

		refreshParents: function refreshParents(oldChild, newChild) {
			var __ = oldChild.__,
			    i;

			if (__.listener) this.trigger(newChild, 'update', newChild);

			if (!__.parents.length) {
				if (__.listener) {
					__.listener.trigger('immediate', oldChild, newChild);
				}
			} else {
				for (i = __.parents.length - 1; i >= 0; i--) {
					// If there is more than one parent, mark everyone as dirty
					// but the last in the iteration, and when the last is refreshed
					// it will update the dirty nodes.
					if (i == 0) this.refresh(__.parents[i], oldChild, newChild, false);else {

						this.markDirty(__.parents[i], [oldChild, newChild]);
					}
				}
			}
		},

		markDirty: function markDirty(node, dirt) {
			var __ = node.__,
			    i;
			__.dirty = dirt;

			// If there is a transaction happening in the node
			// update the transaction data immediately
			if (__.trans) this.refresh(node, dirt[0], dirt[1]);

			for (i = __.parents.length - 1; i >= 0; i--) {

				this.markDirty(__.parents[i], dirt);
			}
		},

		removeParent: function removeParent(node, parent) {
			var parents = node.__.parents,
			    index = parents.indexOf(parent);

			if (index != -1) {

				parents.splice(index, 1);
			}
		},

		addParent: function addParent(node, parent) {
			var parents = node.__.parents,
			    index = parents.indexOf(parent);

			if (index == -1) {
				parents[parents.length] = parent;
			}
		},

		trigger: function trigger(node, eventName, param) {
			var listener = node.__.listener,
			    ticking = listener.ticking;

			listener.ticking = param;
			if (!ticking) {
				Utils.nextTick(function () {
					var updated = listener.ticking;
					listener.ticking = false;
					listener.trigger(eventName, updated);
				});
			}
		},

		createListener: function createListener(frozen) {
			var l = frozen.__.listener;

			if (!l) {
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

		createArray: (function () {
			// Set createArray method
			if ([].__proto__) return function (length) {
				var arr = new Array(length);
				arr.__proto__ = Mixins.List;
				return arr;
			};
			return function (length) {
				var arr = new Array(length),
				    methods = Mixins.arrayMethods;
				for (var m in methods) {
					arr[m] = methods[m];
				}
				return arr;
			};
		})()
	};
	//#build

	module.exports = Frozen;

/***/ }
/******/ ])
});
;