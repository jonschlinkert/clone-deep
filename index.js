'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');

const TYPES_COLLECTION = ['object', 'array']

function cloneDeep(val) {
  return TYPES_COLLECTION.includes(typeOf(val)) ? cloneCollection(val) : clone(val);
}

function cloneCollection(val) {
  const res = new val.constructor();
  for (const key in val) {
    res[key] = cloneDeep(val[key]);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
