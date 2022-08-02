'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');
const isPlainObject = require('is-plain-object');
const whatsCircular = require('whats-circular');
const includes = require('lodash.includes');
const get = require('lodash.get');


function cloneDeep (val, instanceClone) {
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


function cloneObjectDeep (val, instanceClone) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    const circulars = (whatsCircular(val) ?? []).map(c => get(val, c));

    for (let key in val) {
      if (includes(circulars, val[key])) {
        res[key] = clone(val[key]);
      } else {
        res[key] = cloneDeep(val[key], instanceClone);
      }
    }
    return res;
  }
  return val;
}


function cloneArrayDeep (val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}


/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
