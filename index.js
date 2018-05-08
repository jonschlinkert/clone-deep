'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');

const TYPES_COLLECTION = ['object', 'array'];

function cloneDeep(val, fn) {
  return TYPES_COLLECTION.includes(typeOf(val)) ? cloneCollection(val, fn) : clone(val);
}

function cloneCollection(val) {
  if (typeof instanceClone === 'function') return instanceClone(val);
  const res = new val.constructor();
  for (const key in val) {
    res[key] = cloneDeep(val[key], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
