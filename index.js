'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');

function cloneDeep(val, instanceClone) {
  const type = typeOf(val)

  switch (type) {
    case 'object':
      return cloneObjectDeep(val, instanceClone, type);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default:
      return clone(val);
  }
}

function cloneObjectDeep(val, instanceClone, type) {
  switch (type) {
    case 'function':
      return instanceClone(val);
    case 'object':
      const res = new val.constructor();
      for (const key in val) res[key] = cloneDeep(val[key], instanceClone);
      return res;
    default:
      return val;
  }
}

function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) res[i] = cloneDeep(val[i], instanceClone);
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
