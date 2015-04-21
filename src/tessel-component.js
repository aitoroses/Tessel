import React from 'react';
import {decorate as Mixin} from 'react-mixin';

module.exports = function tesselComponentFactory() {

  var componentMixin = this.mixin;

  @Mixin(componentMixin)
  class TesselComponent extends React.Component {}

  return TesselComponent;
}
