import Tracker from '../lib/tracker';
import ReactiveDict from '../lib/reactive-dict';

import immutable from 'immutable';
import {fromJS} from 'immutable';
var Cursor = require('immutable/contrib/cursor');

class Tessel {

  constructor() {
    this._dict = new ReactiveDict();
  }

  set(key, data) {
    // CORTEX?
  }

  get(key) {
    // CORTEX?
  }
}

export default Tessel;
