import expect from 'expect';
import Tessel from '../tessel';
import Tracker from '../../lib/tracker'

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

  });

  describe('with data', () => {

    var testData = {
      a: 'b',
      c: ['d', 'hello']
    };

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
      Tracker.autorun(() => {
        // Run the first time
        data = store.get();
        if (autorun > 0) {
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
