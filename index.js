'use strict';

/**
 * Module dependenices
 */

var lazy = require('lazy-cache')(require);
lazy('is-plain-object', 'isObject');
lazy('shallow-clone', 'clone');
lazy('for-own', 'forOwn');
lazy('kind-of', 'typeOf');

/**
 * Recursively clone native types.
 */

function cloneDeep(val, instanceClone) {
  switch (lazy.typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default:
      return lazy.clone(val);
  }
}

function cloneObjectDeep(obj, instanceClone) {
  if (lazy.isObject(obj)) {
    var res = {};
    lazy.forOwn(obj, function (obj, key) {
      this[key] = cloneDeep(obj, instanceClone);
    }, res);
    return res;
  } else if (instanceClone) {
    return instanceClone(obj);
  } else {
    return obj;
  }
}

function cloneArrayDeep(arr, instanceClone) {
  var len = arr.length, res = [];
  var i = -1;
  while (++i < len) {
    res[i] = cloneDeep(arr[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
