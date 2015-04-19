import expect from 'expect';
import Tessel from '../tessel';
import Tracker from '../../lib/tracker'
import ReactiveVar from '../../lib/reactive-var';

var testData = {
  a: 'b',
  c: ['d', 'hello']
};

describe('A new Tessel instance', () => {

  describe('without any data', () => {

    var store;
    beforeEach(() => {
      store = new Tessel();
    });

    it('should have an empty value inside', () => {
      var data = store.get().toJS();
      expect(Object.keys(data).length).toBe(0);
    });

    it('should do updates', (done) => {
      var data = store.get();
      var updated = data.set({hello: "Hi"});

      expect(updated.hello).toBe("Hi");
      expect(data.hello).toBe(undefined);
      expect(Object.keys(updated.toJS()).length).toBe(1);
      expect(Object.keys(data.toJS()).length).toBe(0);

      // On next tick should have been updated
      setTimeout(() => {
        data = store.get().toJS();
        expect(Object.keys(data).length).toBe(1);
        expect(data.hello).toBe("Hi");
        done();
      })
    });

    it('should reset', (done) => {
      var data = { list: [0,1,2,3,4] }
      store.set(data);
      setTimeout(() => {
        expect(store.get().list[2]).toBe(2);
        done()
      });
    });

    it('#dehydrate', () => {
      expect(store.dehydrate()).toBe("{}");
    });

    it('#rehydrate', (done) => {
      store.rehydrate('{"hello": "world"}');
      expect(store.internalData.hello).toBe("world");
      expect(store.get().hello).toBe(undefined);
      expect(store.dehydrate()).toBe(JSON.stringify({hello: "world"}));

      // Reactivity check
      store.deferredRun(() => {
        expect(store.get().hello).toBe("world");
        done()
      });
    });

  });

  describe('with data', () => {

    var store;
    beforeEach(() => {
      store = new Tessel(testData);
    });

    it('should recover data', () => {
      var data = store.get();
      expect(data.c[1]).toBe("hello");
    });

    it('should update data in any branch', (done) => {

      // Get data from the store
      var data = store.get();
      expect(data.c[1]).toBe("hello");

      // Update the data
      var updated = data.c.push("goodbye");
      expect(updated[2]).toBe("goodbye");
      expect(data.c[2]).toNotBe("goodbye");

      // On next tick should have been updated
      setTimeout(() => {
        data = store.get().toJS();
        expect(data.c[2]).toBe("goodbye");
        done();
      })
    });

    it('should reset', (done) => {
      var data = { list: [0,1,2,3,4] }
      store.set(data);
      setTimeout(() => {
        expect(store.get().list[2]).toBe(2);
        done()
      });
    });

    it('#dehydrate', () => {
      expect(store.dehydrate()).toBe(JSON.stringify(testData));
    });

    it('#rehydrate', (done) => {
      store.rehydrate('{"hello": "world"}');
      expect(store.internalData.hello).toBe("world");
      expect(store.get().hello).toBe(undefined);
      expect(store.dehydrate()).toBe(JSON.stringify({hello: "world"}));

      // Reactivity check
      store.deferredRun(() => {
        expect(store.get().hello).toBe("world");
        done()
      });
    });
  });

  describe('with a computation in tracker', () => {

    var testData = {
      a: 'b',
      c: ['d', 'hello']
    };

    var store;
    beforeEach(() => {
      store = new Tessel(testData);
    });

    it('should update data in any branch', (done) => {

      // Get data from the store reactively
      var autorun = 0
      var data;
      Tessel.autorun(() => {
        // Run the first time
        data = store.get();
        if (autorun == 1) {
          // Check if data was modified
          expect(data.a).toBe("modified");
          done()
        }
        // Increase the call count
        autorun++;
      })

      // Modify the data
      data.set('a', "modified");
    });
  });
});
