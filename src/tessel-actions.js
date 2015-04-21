var axn = require('axn');

export function createActions(specs) {
  var obj = {};
  if (Array.isArray(specs)) {
    specs.forEach(function (name) {
      obj[name] = axn();
    });
  } else {
    Object.keys(specs).forEach(function (name) {
      obj[name] = axn(specs[name]);
    });
  }
  return obj;
}

export function createAsyncActions(specs) {
  var obj = {};
  if (Array.isArray(specs)) {
    specs.forEach(function (name) {
      obj[name] = axn.async();
    });
  } else {
    Object.keys(specs).forEach(function (name) {
      obj[name] = axn.async(specs[name]);
    });
  }
  return obj;
}
