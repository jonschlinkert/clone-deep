'use strict';

/**
 * Module dependenices
 */

var isObject = require('is-plain-object');
var clone = require('shallow-clone');
var typeOf = require('kind-of');
var forOwn = require('for-own');

/**
 * Recursively clone native types.
 */

function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default: {
      return clone(val);
    }
  }
}

function cloneObjectDeep(obj, instanceClone) {
  if (isObject(obj) || (instanceClone === true && typeOf(obj) === 'object')) {
    var res = {};
    forOwn(obj, function(val, key) {
      this[key] = cloneDeep(val, instanceClone);
    }, res);
    return res;
  } else if (typeof instanceClone === 'function') {
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
