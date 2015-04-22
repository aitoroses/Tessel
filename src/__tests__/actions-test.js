import expect from 'expect';
import Tessel from '../tessel';

var tessel, actions,  testData = {
  list: ["one", "two", "three"],
  hash: {
    "hello": "world"
  }
}

describe('Tessel Actions', () => {

  before(() => {
    // Clean other tests computations
    Tessel.flush();
  });

  describe('Synchronous', () => {
    // Render the component on each test
    beforeEach(() => {
      tessel = new Tessel(testData);
      actions = Tessel.createActions(["hitMe"]);
    });

    /**
     * TESTS
     */
    it('should be callable and listenable', () => {
      var spy = expect.createSpy(() => {}).andCall(() => {
        expect(spy.getLastCall().arguments[0]).toBe("HIT");
      });
      // Call the first time
      actions.hitMe("HOT");
      expect(spy.getLastCall()).toBe(undefined);

      // Call with listener
      actions.hitMe.listen(spy);
      actions.hitMe("HIT");
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Asynchronous', () => {
    // Render the component on each test
    beforeEach(() => {
      tessel = new Tessel(testData);
      actions = Tessel.createAsyncActions(["hitMe"]);
    });

    /**
     * TESTS
     */
    it('should be callable and listenable', (done) => {

      // Call with listener
      actions.hitMe.listen((data) => new Promise((resolve, reject) => {
        resolve(data + data);
      }));

      actions.hitMe("HIT").then((data) => {
        expect(data).toBe("HITHIT");
        done();
      });
    });

    it('should work with Tessel Store', (done) => {

      Tessel.deferredRun(tessel, () => {
        expect(tessel.get().hash.hello).toBe("goodbye");
        done();
      });

      // Call with listener
      actions.hitMe.listen((data) => new Promise((resolve) => {
        tessel.get().hash.set('hello', 'goodbye');
        resolve(tessel.internalData);
      }));

      actions.hitMe().then((tesselData) => {
        // When al listeners finish
        expect(tesselData.hash.hello).toBe("goodbye");
      });
    });
  });
});
