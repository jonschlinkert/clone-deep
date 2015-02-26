'use strict';

/**
 * Module dependenices
 */

var typeOf = require('kind-of');
var forOwn = require('for-own');
var isPlainObject = require('is-plain-object');
var mixin = require('mixin-object');


/**
 * Recursively clone native types.
 */

function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
  case 'object':
    return cloneObjectDeep(val, instanceClone);
  case 'array':
    return cloneArrayDeep(val, instanceClone);
  default:
    return clone(val);
  }
}

function cloneObjectDeep(obj, instanceClone) {
  if (isPlainObject(obj)) {
    var res = {};
    forOwn(obj, function (obj, key) {
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
  var len = arr.length;
  var res = [];
  var i = -1;

  while (++i < len) {
    res[i] = cloneDeep(arr[i], instanceClone);
  }
  return res;
}

function clone(val) {
  switch (typeOf(val)) {
  case 'object':
    return cloneObject(val);
  case 'array':
    return cloneArray(val);
  case 'regexp':
    return cloneRegExp(val);
  case 'date':
    return cloneDate(val);
  default:
    return val;
  }
}

function cloneObject(obj) {
  if (isPlainObject(obj)) {
    return mixin({}, obj);
  } else {
    return obj;
  }
}

function cloneRegExp(re) {
  var flags = '';
  flags += re.multiline ? 'm' : '';
  flags += re.global ? 'g' : '';
  flags += re.ignorecase ? 'i' : '';
  return new RegExp(re.source, flags);
}

function cloneDate(date) {
  return new Date(+date);
}

function cloneArray(arr) {
  return arr.slice();
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;