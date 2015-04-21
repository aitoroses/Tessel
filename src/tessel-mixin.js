import Tessel from './tessel';

module.exports = function tesselMixi() {
  var self = this;
  var mixin = {
    getInitialState() {
      return self.get();
    },
    componentDidMount() {
      // Initialize the computations
      var computations = this._computations = this._computations || [];
      var computation = Tessel.autorun(() => {
        this.setState(self.get());
      });
      computations.push(computation);
    },
    componentWillUnmount() {
      this._computations.forEach(c => c.stop());
    }
  }
  return mixin;
}
