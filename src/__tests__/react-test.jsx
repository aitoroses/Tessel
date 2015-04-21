import expect from 'expect';
import React from 'react/addons';
import Tessel from '../tessel';
import {decorate as Mixin} from 'react-mixin';

var Tracker = Tessel.Tracker;

var tessel, testData = {
  list: ["one", "two", "three"],
  hash: {
    "hello": "world"
  }
}

var TesselComponent;

describe('React Mixin', () => {

  before(() => {
    // Clean other tests computations
    Tessel.flush();
  });

  var rendered, div, component;

  // Render the component on each test
  beforeEach(() => {

    tessel = new Tessel(testData);

    @Mixin(tessel.mixin)
    class TesselComponentScoped extends React.Component {

      state = {mixedState: true}

      render() {
        return (
          <div className="tessel-component">{JSON.stringify(this.state)}</div>
        )
      }
    }
    TesselComponent = TesselComponentScoped;

    // Create a placeholder
    div = document.createElement("div");

    // Render the component
    component = React.render(<TesselComponent/>, div);
    rendered = div.children[0];

  });

  // Unmount the component on each test
  afterEach(() => {
    React.unmountComponentAtNode(div);
  });

  /**
   * TESTS
   */

  it('Should provide state to component', () => {
    var r = rendered;
    var state = JSON.parse(rendered.innerHTML);
    expect(state.list.length).toBe(3);
    expect(state.mixedState).toBe(true);
    expect(state.hash.hello).toBe("world");
  });

  it('Should create a computation', () => {
    expect(Object.keys(Tracker._computations).length).toBe(1);
  });

  it('Should update state when computation gets invalidated', (done) => {
    tessel.get().hash.set("hello", "goodbye");
    var comp = Tessel.deferredRun(tessel, () => {
      var val = tessel.get();
      expect(val.hash.hello).toBe("goodbye");
      comp.stop();
      // Validate the component state
      expect(rendered.innerHTML).toMatch(/goodbye/);
      done();
    });
  });

  it('Should remove the computations when unmounted', () => {
    expect(Object.keys(Tracker._computations).length).toBe(1);
    React.unmountComponentAtNode(div);
    expect(Object.keys(Tracker._computations).length).toBe(0);
  });
});

describe('React Component', () => {

  before(() => {
    // Clean other tests computations
    Tessel.flush();
  });

  var rendered, div, component;

  // Render the component on each test
  beforeEach(() => {

    tessel = new Tessel(testData);

    class TesselComponentScoped extends tessel.Component {

      state = {mixedState: true}

      render() {
        return (
          <div className="tessel-component">{JSON.stringify(this.state)}</div>
        )
      }
    }
    TesselComponent = TesselComponentScoped;

    // Create a placeholder
    div = document.createElement("div");

    // Render the component
    component = React.render(<TesselComponent/>, div);
    rendered = div.children[0];

  });

  // Unmount the component on each test
  afterEach(() => {
    React.unmountComponentAtNode(div);
  });

  it('Should provide state to component', () => {
    var r = rendered;
    var state = JSON.parse(rendered.innerHTML);
    expect(state.list.length).toBe(3);
    expect(state.mixedState).toBe(true);
    expect(state.hash.hello).toBe("world");
  });
})
