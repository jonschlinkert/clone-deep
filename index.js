'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');
const isPlainObject = require('is-plain-object');
const whatsCircular = require('whats-circular');
const includes = require('lodash.includes');
const find = require('lodash.find');
const get = require('lodash.get');
const set = require('lodash.set');


function cloneDeep (val, instanceClone) {
  const circularsPaths = whatsCircular(val);
  const circulars = circularsPaths !== undefined ?
    circularsPaths.map(c => ({ val: get(val, c), path: c, parentPath: undefined })) :
    undefined;

  let cloned = _cloneDeep(val, instanceClone, circulars, circularsPaths, []);

  if (Array.isArray(circulars)) {
    circulars.forEach((c) => {
      const pointer = get(cloned, c.parentPath);
      set(cloned, c.path, pointer);
    });
  }

  return cloned;
}


function _cloneDeep (val, instanceClone, circulars, circularsPaths, parentPath) {
  switch (typeOf(val)) {
    case 'array':
    case 'object':
      return cloneObjectDeep(val, instanceClone, circulars, circularsPaths, parentPath);
    default: {
      return clone(val);
    }
  }
}


function cloneObjectDeep (val, instanceClone, circulars, circularsPaths, parentPath) {
  if (typeof instanceClone === 'function' && !Array.isArray(val)) {
    return instanceClone(val);
  }

  if (instanceClone || Array.isArray(val) || isPlainObject(val)) {
    const res = new val.constructor(Array.isArray(val) ? val.length : undefined);

    for (let key in val) {
      const keyPath = parentPath.concat([key]);
      // check if value of val[key] is in circulars (is this not a parent of a circular) and ensure we didn't already assign a parent path to it?
      let circ, goDeeper = true;
      if ((circ = find(circulars, (c) => !c.parentPath && c.val === val[key], 0))) {
        circ.parentPath = keyPath;
      } else if ((circ = find(circulars, { path: keyPath }, 0))) {
        goDeeper = false;
      }

      if (goDeeper) {
        res[key] = _cloneDeep(val[key], instanceClone, circulars, circularsPaths, keyPath);
      }
    }

    return res;
  }

  return val;
}


/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
