import expect from 'expect';
import Tessel from '../tessel';

var tessel, testData = {
  val: 123,
  list: ["one", "two", "three"],
  hash: {
    "hello": "world"
  }
}

describe("Tessel History", () => {

  before(() => {
    // Clean other tests computations
    Tessel.flush();
  });

  beforeEach(() => {
    tessel = new Tessel(testData);
  })

  it("should be able to save current state into a history LILO queue", () => {
    // Initially 0
    expect(tessel._history.length).toBe(0);
    expect(tessel._historyIndex).toBe(null);

    // Save current state
    tessel.save();
    expect(tessel._history.length).toBe(1);
    expect(tessel._historyIndex).toBe(0);

    // Save current state again
    tessel.save();
    expect(tessel._history.length).toBe(2);
    expect(tessel._historyIndex).toBe(1);
  });

  it("should be able to restore current state from the history with undo()", () => {

    // Save the state 2 times
    tessel.save();
    tessel.save()

    var currentState = tessel.get();
    expect(currentState.val).toBe(123);

    // Do a transaction
    var trans = currentState.transact();
    trans.val = 234;
    currentState.run();

    // Check updated data
    var updated = tessel.internalData;
    expect(updated.val).toBe(234);

    // Restore the state
    tessel.undo();
    expect(tessel._history.length).toBe(2);
    expect(tessel._historyIndex).toBe(0);

    // Check restored data
    var restored = tessel.internalData;
    expect(restored.val).toBe(123);
  })

  it("should be able to recover undoed state from the history with redo()", () => {
    var currentState = tessel.get();

    // Save the state
    tessel.save();

    // Do a transaction
    var trans = currentState.transact();
    trans.val = 234;
    currentState.run();

    // Save the state
    tessel.save();

    // undo the state
    tessel.undo();

    // Redo the state
    tessel.redo();

    // Check restored data
    var restored = tessel.internalData;
    expect(restored.val).toBe(234);

    expect(tessel._history.length).toBe(2);
    expect(tessel._historyIndex).toBe(1);
  })
});
