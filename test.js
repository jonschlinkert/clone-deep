'use strict';

require('mocha');
const assert = require('assert');
const clone = require('./');

describe('cloneDeep()', function() {
  it('should clone arrays', function() {
    assert.deepEqual(clone(['alpha', 'beta', 'gamma']), ['alpha', 'beta', 'gamma']);
    assert.deepEqual(clone([1, 2, 3]), [1, 2, 3]);

    const a = [{ 'a': 0 }, { 'b': 1 }];
    const b = clone(a);

    assert.deepEqual(b, a);
    assert.deepEqual(b[0], a[0]);

    const val = [0, 'a', {}, [{}], [function() {}], function() {}];
    assert.deepEqual(clone(val), val);
  });

  it('should deeply clone an array', function() {
    const fixture = [[{a: 'b'}], [{a: 'b'}]];
    const result = clone(fixture);
    assert(fixture !== result);
    assert(fixture[0] !== result[0]);
    assert(fixture[1] !== result[1]);
    assert.deepEqual(fixture, result);
  });

  it('should deeply clone object', function() {
    const one = {a: 'b'};
    const two = clone(one);
    two.c = 'd';
    assert.notDeepEqual(one, two);
  });

  it('should deeply clone arrays', function() {
    const one = {a: 'b'};
    const arr1 = [one];
    const arr2 = clone(arr1);
    one.c = 'd';
    assert.notDeepEqual(arr1, arr2);
  });

  it('should deeply clone Map', function() {
    const a = new Map([[1, 5]]);
    const b = clone(a);
    a.set(2, 4);
    assert.notDeepEqual(Array.from(a), Array.from(b));
  });

  it('should deeply clone Set', function() {
    const a = new Set([2, 1, 3]);
    const b = clone(a);
    a.add(8);
    assert.notDeepEqual(Array.from(a), Array.from(b));
  });

  it('should return primitives', function() {
    assert.equal(clone(0), 0);
    assert.equal(clone('foo'), 'foo');
  });

  it('should clone a regex', function() {
    assert.deepEqual(clone(/foo/g), /foo/g);
  });

  it('should clone objects', function() {
    assert.deepEqual(clone({a: 1, b: 2, c: 3 }), {a: 1, b: 2, c: 3 });
  });

  it('should deeply clone objects', function() {
    assert.deepEqual(clone({a: {a: 1, b: 2, c: 3 }, b: {a: 1, b: 2, c: 3 }, c: {a: 1, b: 2, c: 3 } }), {a: {a: 1, b: 2, c: 3 }, b: {a: 1, b: 2, c: 3 }, c: {a: 1, b: 2, c: 3 } });
  });

  it('should deep clone instances with instanceClone true', function() {
    function A(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    function B(x) {
      this.x = x;
    }

    const a = new A({x: 11, y: 12, z: () => 'z'}, new B(2), 7);
    const b = clone(a, true);

    assert.deepEqual(a, b);

    b.y.x = 1;
    b.z = 2;
    assert.notDeepEqual(a, b);
    assert.notEqual(a.z, b.z, 'Root property of original object not expected to be changed');
    assert.notEqual(a.y.x, b.y.x, 'Nested property of original object not expected to be changed');
  });

  it('should not deep clone instances', function() {
    function A(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    function B(x) {
      this.x = x;
    }

    const a = new A({x: 11, y: 12, z: () => 'z'}, new B(2), 7);
    const b = clone(a);

    assert.deepEqual(a, b);

    b.y.x = 1;
    b.z = 2;
    assert.deepEqual(a, b);
    assert.equal(a.z, b.z);
    assert.equal(a.y.x, b.y.x);
  });

  it('should deep clone instances with instanceClone self defined', function() {
    function A(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    function B(x) {
      this.x = x;
    }

    const a = new A({x: 11, y: 12, z: () => 'z'}, new B(2), 7);
    const b = clone(a, function(val){
      if (val instanceof A) {
        const res = new A();
        for (const key in val) {
          res[key] = clone(val[key]);
        }
        return res;
      } else {
        return clone(val);
      }
    });

    assert.deepEqual(a, b);

    b.y.x = 1;
    b.z = 2;
    assert.notDeepEqual(a, b);
    assert.notEqual(a.z, b.z, 'Root property of original object not expected to be changed');
    assert.equal(a.y.x, b.y.x);
  });
});
