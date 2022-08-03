'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');
const isPlainObject = require('is-plain-object');
const findIndex = require('lodash.findindex');
const isEqual = require('lodash.isequal');


function cloneDeep (val, instanceClone) {
  // get an instance of the main val into parentsRes first, we need this for checking and setting of clone circular references
  // undefined root will skip cloning in cloneObjectDeep and just get the new instance
  const parentsRes = [_cloneDeep(val, instanceClone)];

  // don't repeat if these will result same as parentsRes[0]
  if (/array|object/.test(typeOf(val))) {
    if (!/function|undefined/.test(typeof instanceClone) || typeof val === 'object') {
      return _cloneDeep(val, instanceClone, parentsRes[0], parentsRes, [val]);
    }
  }
  return parentsRes[0];
}


function _cloneDeep (val, instanceClone, root, parentsRes, parentsVal) {
  switch (typeOf(val)) {
    case 'array':
    case 'object':
      return cloneObjectDeep(val, instanceClone, root, parentsRes, parentsVal);
    default: {
      return clone(val);
    }
  }
}


function cloneObjectDeep (val, instanceClone, root, parentsRes, parentsVal) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }

  if (instanceClone || Array.isArray(val) || isPlainObject(val)) {
    let res;
    if (root) {
      res = root; // don't directly use root to avoid confusion
    } else {
      res = new val.constructor(Array.isArray(val) ? val.length : undefined);
    }

    // if root is undefined then this was just a clone object constructor
    if (root) {
      for (let key in val) {
        let circularIndex = findIndex(parentsVal, v => isEqual(v, val[key]));
        if (~circularIndex) {
          res[key] = parentsRes[circularIndex];
        } else {
          if (Array.isArray(val[key]) || isPlainObject(val[key]) || typeof instanceClone === typeof val[key]) {
            // this is some kind of object
            parentsVal.push(val[key]);

            const keyRoot = _cloneDeep(val[key], instanceClone); // get instance for object at val[key]
            res[key] = keyRoot;
            parentsRes.push(keyRoot);

            // the following will clone val[key] object on keyRoot/res[key]
            _cloneDeep(val[key], instanceClone, keyRoot, parentsRes, parentsVal);
          } else {
            // this is a scalar property
            res[key] = _cloneDeep(val[key], instanceClone, res, parentsRes, parentsVal);
          }
        }
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
