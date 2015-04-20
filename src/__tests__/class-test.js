import expect from 'expect';
import Tessel from '../tessel';
import Tracker from '../../lib/tracker'
import ReactiveVar from '../../lib/reactive-var';

describe('Tessel class', () => {

  it('should have a property to access tracker', () => {
    var Tracker = Tessel.Tracker
    expect(Tracker._computations).toNotBe(undefined);
  })

  it('#createVar', (done) => {
    var myVal = Tessel.createVar("hello");
    expect(myVal.get()).toBe("hello");

    Tessel.deferredRun(myVal, () => {
      expect(myVal.get()).toBe("hello again");
      done();
    })

    myVal.set('hello again');
  })

  it('should have a method for calling autorun (tracker)', (done) => {
    var autorun = 0;
    var a = new ReactiveVar("hello");

    var value = a.get();
    expect(value).toBe("hello")

    Tessel.autorun(() => {
      // will run the first time
      value = a.get();
      if (autorun == 1) {
        // Check if data was modified
        expect(value).toBe("world");
        done()
      }
      // Increase the call count
      autorun++;
    });

    // Change the reactive var
    a.set("world")
  })

  it('should be able to clean all active computations', () => {
    Tessel.flush();
    expect(Object.keys(Tracker._computations).length).toBe(0)
    Tessel.autorun(() => {});
    Tessel.autorun(() => {});
    expect(Object.keys(Tracker._computations).length).toBe(2);
    Tessel.flush();
    expect(Object.keys(Tracker._computations).length).toBe(0);
  })
});
