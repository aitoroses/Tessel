import expect from 'expect';
import Tessel from '../tessel';

var testData = {
  list: ["one", "two", "three"],
  hash: {
    "hello": "world"
  }
}

class TestStore {
  constructor() {
    this.bindState('hash');
  }
  get() {
    return this.state.hello;
  }
}

class TestActions {
  set(payload, resolve, reject) {
    this.set('hello', payload);
    resolve(payload);
  }
}

describe.only('Tessel Store', () => {
  var store, tessel, actions;

  beforeEach(() => {
    tessel = new Tessel(testData);
    store = tessel.createStore(TestStore);
    actions = store.createActions(TestActions);

    // Clean other tests computations
    Tessel.flush();
  });

  it('should have binded state', () => {
    expect(store.state.hello).toBe("world");
  })

  it('should have state property in it methods context', () => {
    expect(store.get()).toBe("world");
  })

  it('should create actions from class descriptor', () => {
    expect(Object.getOwnPropertyNames(actions)).toEqual(["set"]);
  })

  it('should create asynchronous actions called with the store state as context', (done) => {
    expect(store.get()).toBe("world");

    actions.set("murray").then((res) => {
      expect(store.get()).toBe("murray");
      expect(res);
      done();
    });
  });

  it('should emit "update" event when the state has changed (shallowEqual)', (done) => {
    expect(store.get()).toBe("world");

    store.on('update', () => {
      expect(store.get()).toBe("murray");
      done();
    });

    actions.set("murray");
  })

  it('changes done through actions should be reactive (tracker)', (done) => {
    expect(store.get()).toBe("world");

    Tessel.deferredRun(tessel, () => {
      expect(store.get()).toBe("murray");
      done();
    });

    actions.set("murray");
  })

  it('should provide a way to initialize store state with "state" property before binding', () => {

    class TestStore1 {
      state = {
        hi: "murray"
      }
      constructor() {
        this.bindState('hash');
      }
      get() {
        return this.state.hi;
      }
    }

    store = tessel.createStore(TestStore1);

    expect(store.get()).toBe("murray");
    expect(tessel.internalData.hash.hi).toBe("murray");
  })
});
